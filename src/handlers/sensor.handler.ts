import { INVALID_SCRIPT, SENSOR_NOT_EXISTS } from "@constants";
import { prisma } from "@repositories";
import { scriptSchema, UpdateSensorDto } from "@schemas/in";
import { SensorDetailDto, SensorSummaryDto } from "@schemas/out";
import { FastifyReply, FastifyRequest } from "fastify";
import Ajv from "ajv";
import yaml from "js-yaml";

const ajv = new Ajv({ allErrors: false, strict: false });

async function getByClusterId(request: FastifyRequest<{ Querystring: { clusterId: string } }>): Result<SensorSummaryDto[]> {
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
    return sensors.map((sensor) => ({ ...sensor, state: "RUNNING" }));
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
            topicConfigs: {
                select: {
                    id: true,
                    kafkaTopic: {
                        select: {
                            id: true,
                            name: true,
                            broker: { select: { id: true, name: true, url: true } }
                        }
                    },
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
        state: "RUNNING",
        subscribeTopics: sensor.topicConfigs.map((topicConfig) => ({
            key: topicConfig.id,
            id: topicConfig.kafkaTopic.id,
            name: topicConfig.kafkaTopic.name,
            interval: topicConfig.interval,
            script: topicConfig.script,
            broker: topicConfig.kafkaTopic.broker,
            usingTemplate: topicConfig.usingTemplate
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

    for (const topic of payload.subscribeTopics) {
        const filterAST = yaml.load(topic.script.replaceAll("\t", "  ")) as ConfigScriptAST;
        const scriptValidate = ajv.compile(scriptSchema.valueOf());
        const validateResult = scriptValidate(filterAST);
        if (filterAST.type === "io") {
            filterAST.fields.deviceName;
        }

        if (!validateResult) {
            request.log.error(scriptValidate.errors);
            return reply.badRequest(INVALID_SCRIPT);
        }
    }

    await prisma.$transaction([
        prisma.sensorTopicConfig.deleteMany({
            where: { sensorId }
        }),
        prisma.sensor.update({
            data: {
                name: payload.name,
                remarks: payload.remarks,
                topicConfigs: {
                    createMany: {
                        data: payload.subscribeTopics.map((item) => ({
                            interval: item.interval,
                            script: item.script,
                            filterTemplateId: item.usingTemplateId,
                            kafkaTopicId: item.id
                        }))
                    }
                }
            },
            where: { id: sensorId }
        })
    ]);
    return sensorId;
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
