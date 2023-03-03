import { SensorStatus } from "@prisma/client";
import { prisma } from "@repositories";
import { GetAllClusters } from "@schemas/out";
import { Result } from "@types";

async function getClusters(): Result<GetAllClusters> {
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

export const clusterCtrler = {
    getClusters
};
