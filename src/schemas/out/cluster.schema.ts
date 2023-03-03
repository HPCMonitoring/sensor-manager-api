import s from "fluent-json-schema";
import { idSchema } from "../common.schema";

export const clusterSchema = s
    .object()
    .prop("id", idSchema)
    .prop("name", s.string())
    .prop("remarks", s.mixed(["string", "null"]).examples(["Some notes ..."]));

export type Cluster = {
    id: string;
    name: string;
    remarks: string | null;
};

export const getAllClustersSchema = s.array().items(
    s
        .object()
        .prop("id", idSchema)
        .prop("name", s.string().examples(["BK HPC Laboratory"]))
        .prop("remarks", s.mixed(["string", "null"]))
        .prop("numOfSensors", s.number())
        .prop("numOfActiveSensors", s.number())
);

export type GetAllClusters = Array<
    Cluster & {
        numOfSensors: number;
        numOfActiveSensors: number;
    }
>;