import { INVALID_SCRIPT, SENSOR_NOT_EXISTS } from "@constants";
import { prisma } from "@repositories";
import { UpdateSensorDto, validateConfigScript } from "@dtos/in";
import { SensorDetailDto, SensorSummaryDto } from "@dtos/out";
import { FastifyReply, FastifyRequest } from "fastify";
import { sensorManager } from "@services";
import yaml from "js-yaml";

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
    const sensorConfigIns: SensorConfig[] = [];

    for (const kafkaJob of payload.kafkaJobs) {
        try {
            const filterAST = yaml.load(kafkaJob.script.replaceAll("\t", "  ")) as ConfigScriptAST;
            const validateResult = validateConfigScript(filterAST);

            if (!validateResult) {
                request.log.error(validateConfigScript.errors);
                return reply.badRequest(INVALID_SCRIPT);
            }
            sensorConfigIns.push({
                broker: kafkaJob.brokerUrl,
                topicName: kafkaJob.topicName,
                interval: kafkaJob.interval,
                script: filterAST
            });
        } catch (err) {
            request.log.error(err);
            return reply.badRequest(INVALID_SCRIPT);
        }
    }

    try {
        await sensorManager.sendConfig(sensorId, sensorConfigIns);
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
