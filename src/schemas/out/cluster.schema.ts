import { idSchema, nullable } from '@schemas/common';
import s from 'fluent-json-schema';

export const clusterSchema = s
    .object()
    .prop('id', idSchema)
    .prop('name', s.string())
    .prop('remarks', s.string().raw({ nullable: true }).examples(['Some notes ...']));

export type GetCluster = {
    id: string;
    name: string;
    remarks: string | null;
};

export const getAllClustersSchema = s.array().items(
    s
        .object()
        .prop('id', idSchema)
        .prop('name', s.string().examples(['BK HPC Laboratory']))
        .prop('remarks', s.string().raw(nullable))
        .prop('numOfSensors', s.number())
        .prop('numOfActiveSensors', s.number())
);

export type GetAllClusters = Array<
    GetCluster & {
        numOfSensors: number;
        numOfActiveSensors: number;
    }
>;
