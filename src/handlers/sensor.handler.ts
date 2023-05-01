import { INVALID_SCRIPT, SENSOR_CONFIG_FAIL, SENSOR_NOT_EXISTS } from "@constants";
import { prisma } from "@repositories";
import { UpdateSensorDto, validateConfigScript } from "@dtos/in";
import { SensorDetailDto, SensorSummaryDto } from "@dtos/out";
import { FastifyReply, FastifyRequest } from "fastify";

import { filterGenerator, sensorManager } from "@services";
import { buildAST } from "@utils";

async function getByClusterId(
    request: FastifyRequest<{
        Querystring: { clusterId: string };
    }>
): Result<SensorSummaryDto[]> {
    const sensors = await prisma.sensor.findMany({
        select: {
            id: true,
            name: true,
            ipAddr: true,
            remarks: true
        },
        where: {
            clusterId: request.query.clusterId
        }
    });
    return sensors.map((sensor) => ({ ...sensor, state: sensorManager.getStatus(sensor.id) }));
}

async function getById(
    request: FastifyRequest<{
        Params: { sensorId: string };
    }>,
    reply: FastifyReply
): Result<SensorDetailDto> {
    const sensor = await prisma.sensor.findUnique({
        select: {
            id: true,
            name: true,
            remarks: true,
            ipAddr: true,
            kernelName: true,
            kernelVersion: true,
            arch: true,
            hostname: true,
            rootUser: true,
            jobs: {
                select: {
                    id: true,
                    topicName: true,
                    brokerUrl: true,
                    usingTemplate: {
                        select: { id: true, name: true }
                    },
                    script: true,
                    interval: true
                }
            }
        },
        where: {
            id: request.params.sensorId
        }
    });

    if (!sensor) return reply.badRequest(SENSOR_NOT_EXISTS);
    return {
        id: sensor.id,
        name: sensor.name,
        remarks: sensor.remarks,
        ipAddr: sensor.ipAddr,
        kernelName: sensor.kernelName,
        kernelVersion: sensor.kernelVersion,
        arch: sensor.arch,
        hostname: sensor.hostname,
        rootUser: sensor.rootUser,
        state: sensorManager.getStatus(sensor.id),
        kafkaJobs: sensor.jobs.map((job) => ({
            id: job.id,
            topicName: job.topicName,
            brokerUrl: job.brokerUrl,
            interval: job.interval,
            script: job.script,
            usingTemplate: job.usingTemplate
        }))
    };
}

async function update(
    request: FastifyRequest<{
        Params: { sensorId: string };
        Body: UpdateSensorDto;
    }>,
    reply: FastifyReply
): Result<string> {
    const payload = request.body;
    const sensorId = request.params.sensorId;
    const topicConfigs: WsTopicPayload[] = [];

    for (const kafkaJob of payload.kafkaJobs) {
        try {
            const filterAST = buildAST(kafkaJob.script);
            const validateResult = validateConfigScript(filterAST);

            if (!validateResult) {
                request.log.error(validateConfigScript.errors);
                return reply.badRequest(INVALID_SCRIPT);
            }

            topicConfigs.push({
                broker: kafkaJob.brokerUrl,
                topicName: kafkaJob.topicName,
                interval: kafkaJob.interval,
                type: filterAST.type,
                fields: filterAST.fields as Record<string, string>,
                prefixCommand: "filters" in filterAST ? filterGenerator.toPrefix(filterAST.filters) : ""
            });
        } catch (err) {
            request.log.error(err);
            return reply.badRequest(INVALID_SCRIPT);
        }
    }

    try {
        const configRes = await sensorManager.sendConfig(sensorId, topicConfigs);
        if (configRes.error) {
            request.log.error(`Sensor reply with error ${JSON.stringify(configRes)}`);
            reply.internalServerError(SENSOR_CONFIG_FAIL);
            return;
        }
        await prisma.$transaction([
            prisma.sensorKafkaJob.deleteMany({ where: { sensorId } }),
            prisma.sensor.update({
                data: {
                    name: payload.name,
                    remarks: payload.remarks,
                    jobs: {
                        createMany: {
                            data: payload.kafkaJobs.map((item) => ({
                                topicName: item.topicName,
                                brokerUrl: item.brokerUrl,
                                interval: item.interval,
                                script: item.script,
                                filterTemplateId: item.usingTemplateId
                            }))
                        }
                    }
                },
                where: { id: sensorId }
            })
        ]);
        return reply.send(sensorId);
    } catch (err) {
        global.logger.error(`Fail to send config to sensor. Error message: ${err}`);
        return reply.internalServerError(err);
    }
}

async function deleteSensor(request: FastifyRequest<{ Params: { sensorId: string } }>): Result<string> {
    const sensorId = request.params.sensorId;
    await prisma.sensor.delete({ where: { id: sensorId } });
    return sensorId;
}

export const sensorHandler = {
    getByClusterId,
    getById,
    update,
    delete: deleteSensor
};
