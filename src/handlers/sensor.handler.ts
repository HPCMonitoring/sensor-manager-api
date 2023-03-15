import { SENSOR_NOT_EXISTS } from "@constants";
import { prisma } from "@repositories";
import { GetAllSensors, SensorDetailDto } from "@schemas/out";
import { FastifyReply, FastifyRequest } from "fastify";

async function getByClusterId(request: FastifyRequest<{ Querystring: { clusterId: string } }>): Result<GetAllSensors> {
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
    const topicConfigsQuery = {
        select: {
            kafkaTopic: {
                select: {
                    id: true,
                    name: true,
                    broker: { select: { id: true, name: true } }
                }
            },
            script: true,
            interval: true,
            filterTemplateId: true
        }
    };
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
            topicConfigs: topicConfigsQuery
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
        subscribingTopics: sensor.topicConfigs.map((topicConfig) => ({
            id: topicConfig.kafkaTopic.id,
            name: topicConfig.kafkaTopic.name,
            interval: topicConfig.interval,
            script: topicConfig.script,
            brokerId: topicConfig.kafkaTopic.broker.id,
            brokerName: topicConfig.kafkaTopic.broker.name,
            usingTemplateId: topicConfig.filterTemplateId
        }))
    };
}

export const sensorHandler = {
    getByClusterId,
    getById
};
