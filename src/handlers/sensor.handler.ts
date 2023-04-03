import { INVALID_SCRIPT, SENSOR_NOT_EXISTS, TOPIC_NOT_FOUND } from "@constants";
import { prisma } from "@repositories";
import { scriptSchema, UpdateSensorDto } from "@dtos/in";
import { SensorDetailDto, SensorSummaryDto } from "@dtos/out";
import { FastifyReply, FastifyRequest } from "fastify";
import Ajv from "ajv";
import yaml from "js-yaml";
import { sensorManager } from "@services";
import { SensorConfig } from "@interfaces";

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
        state: sensorManager.getStatus(sensor.id),
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
    const sensorConfigIns: SensorConfig[] = [];

    for (const topic of payload.subscribeTopics) {
        try {
            const filterAST = yaml.load(topic.script.replaceAll("\t", "  ")) as ConfigScriptAST;
            const scriptValidate = ajv.compile(scriptSchema.valueOf());
            const validateResult = scriptValidate(filterAST);

            const sink = await prisma.kafkaTopic.findFirst({
                select: {
                    name: true,
                    broker: {
                        select: {
                            url: true
                        }
                    }
                },
                where: {
                    id: topic.id
                }
            });

            if (!validateResult) {
                request.log.error(scriptValidate.errors);
                return reply.badRequest(INVALID_SCRIPT);
            } else if (!sink) {
                request.log.error(`Topic ID ${topic.id} does not exists`);
                return reply.badRequest(TOPIC_NOT_FOUND);
            }

            sensorConfigIns.push({
                broker: sink.broker.url,
                topicName: sink.name,
                interval: topic.interval,
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
        reply.send(sensorId);
        return sensorId;
    } catch (err) {
        reply.internalServerError(err);
        global.logger.error(`Fail to send config to sensor. Error message: ${err}`);
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
