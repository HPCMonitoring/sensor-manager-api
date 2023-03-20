import { SENSOR_NOT_EXISTS } from "@constants";
import { prisma } from "@repositories";
import { SensorDetailDto, SensorSummaryDto } from "@schemas/out";
import { FastifyReply, FastifyRequest } from "fastify";

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
        subscribingTopics: sensor.topicConfigs.map((topicConfig) => ({
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

export const sensorHandler = {
    getByClusterId,
    getById
};
