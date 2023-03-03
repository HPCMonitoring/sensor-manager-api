import { CLUSTER_NOT_EXISTS, DUPLICATED_CLUSTER } from "@constants";
import { SensorStatus } from "@prisma/client";
import { prisma } from "@repositories";
import { ClusterInput } from "@schemas/in";
import { Cluster, GetAllClusters } from "@schemas/out";
import { Result } from "@types";
import { FastifyReply, FastifyRequest } from "fastify";

async function getAll(): Result<GetAllClusters> {
    const clusters = await prisma.cluster.findMany({
        select: {
            id: true,
            name: true,
            remarks: true,
            sensors: {
                select: {
                    id: true,
                    status: true
                }
            }
        }
    });
    if (clusters.length === 0) return [];
    return clusters.map((cluster) => ({
        id: cluster.id,
        name: cluster.name,
        remarks: cluster.remarks,
        numOfSensors: cluster.sensors.length,
        numOfActiveSensors: cluster.sensors.filter((sensor) => sensor.status === SensorStatus.RUNNING).length
    }));
}

async function create(request: FastifyRequest<{ Body: ClusterInput }>, reply: FastifyReply): Result<Cluster> {
    try {
        const cluster = prisma.cluster.create({
            data: request.body
        });
        return cluster;
    } catch (err) {
        return reply.badRequest(DUPLICATED_CLUSTER);
    }
}

async function update(
    request: FastifyRequest<{
        Body: ClusterInput;
        Params: { clusterId: string };
    }>,
    reply: FastifyReply
): Result<Cluster> {
    try {
        const cluster = await prisma.cluster.update({
            data: request.body,
            where: { id: request.params.clusterId }
        });
        return cluster;
    } catch (err) {
        return reply.badRequest(CLUSTER_NOT_EXISTS);
    }
}

async function deleteCluster(
    request: FastifyRequest<{
        Params: { clusterId: string };
    }>,
    reply: FastifyReply
): Result<Cluster> {
    try {
        return prisma.cluster.delete({
            where: {
                id: request.params.clusterId
            }
        });
    } catch (err) {
        request.log.warn(err);
        return reply.badRequest(CLUSTER_NOT_EXISTS);
    }
}

export const clustersHandler = {
    getAll,
    create,
    update,
    delete: deleteCluster
};
