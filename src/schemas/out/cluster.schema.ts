import { idSchema, nullable } from '@schemas/common';
import s from 'fluent-json-schema';

export const createClusterSchema = s
    .object()
    .prop('id', idSchema)
    .prop('name', s.string())
    .prop('remarks', s.string().raw({ nullable: true }));

export type CreateClusterDto = {
    id: string;
    name: string;
    remarks: string | null;
};

export const clusterSummarySchema = s
    .object()
    .prop('id', idSchema)
    .prop('name', s.string())
    .prop('remarks', s.string().raw(nullable))
    .prop('numOfSensors', s.number())
    .prop('numOfActiveSensors', s.number());

export type ClusterSummaryDto = CreateClusterDto & {
    numOfSensors: number;
    numOfActiveSensors: number;
};
