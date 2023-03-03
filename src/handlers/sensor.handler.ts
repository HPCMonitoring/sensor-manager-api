import { prisma } from "@repositories";
import { GetAllSensors } from "@schemas/out";
import { Result } from "@types";
import { FastifyRequest } from "fastify";

async function getByClusterId(request: FastifyRequest<{ Querystring: { clusterId: string } }>): Result<GetAllSensors> {
    return prisma.sensor.findMany({
        select: {
            id: true,
            name: true,
            ipAddr: true,
            remarks: true,
            status: true
        },
        where: {
            clusterId: request.query.clusterId
        }
    });
}

export const sensorHandler = {
    getByClusterId
};
