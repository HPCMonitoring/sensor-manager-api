import { idSchema, nullable } from "@schemas/common";
import s from "fluent-json-schema";

export const clusterMutationResultSchema = s
    .object()
    .prop("id", idSchema)
    .prop("name", s.string())
    .prop("remarks", s.string().raw(nullable));

export type ClusterMutationResultDto = {
    id: string;
    name: string;
    remarks: string | null;
};

export const clusterSummarySchema = s
    .object()
    .prop("id", idSchema)
    .prop("name", s.string())
    .prop("remarks", s.string().raw(nullable))
    .prop("numOfSensors", s.number())
    .prop("numOfActiveSensors", s.number());

export type ClusterSummaryDto = ClusterMutationResultDto & {
    numOfSensors: number;
    numOfActiveSensors: number;
};
