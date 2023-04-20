import { CLUSTER_NOT_EXISTS, DUPLICATED_CLUSTER } from "@constants";
import { prisma } from "@repositories";
import { ClusterMutationDto } from "@dtos/in";
import { ClusterSummaryDto } from "@dtos/out";
import { FastifyReply, FastifyRequest } from "fastify";

async function getAll(): Result<ClusterSummaryDto[]> {
    const clusters = await prisma.cluster.findMany({
        select: {
            id: true,
            name: true,
            remarks: true,
            sensors: {
                select: {
                    id: true
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
        numOfActiveSensors: 1 // Todo: Fix hard code
    }));
}

async function create(request: FastifyRequest<{ Body: ClusterMutationDto }>, reply: FastifyReply): Result<string> {
    try {
        const cluster = await prisma.cluster.create({
            data: request.body
        });
        return cluster.id;
    } catch (err) {
        return reply.badRequest(DUPLICATED_CLUSTER);
    }
}

async function update(
    request: FastifyRequest<{
        Body: ClusterMutationDto;
        Params: { clusterId: string };
    }>,
    reply: FastifyReply
): Result<string> {
    try {
        const cluster = await prisma.cluster.update({
            data: request.body,
            where: { id: request.params.clusterId }
        });
        return cluster.id;
    } catch (err) {
        return reply.badRequest(CLUSTER_NOT_EXISTS);
    }
}

async function deleteCluster(
    request: FastifyRequest<{
        Params: { clusterId: string };
    }>,
    reply: FastifyReply
): Result<string> {
    try {
        await prisma.cluster.delete({
            where: {
                id: request.params.clusterId
            }
        });
        return request.params.clusterId;
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
