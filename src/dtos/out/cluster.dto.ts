import { idSchema, nullable } from "@dtos/common";
import s from "fluent-json-schema";

export const clusterSummarySchema = s
    .object()
    .prop("id", idSchema)
    .prop("name", s.string())
    .prop("remarks", s.string().raw(nullable))
    .prop("numOfSensors", s.number())
    .prop("numOfActiveSensors", s.number());

export type ClusterSummaryDto = {
    id: string;
    name: string;
    remarks: string | null;
    numOfSensors: number;
    numOfActiveSensors: number;
};
