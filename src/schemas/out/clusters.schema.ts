import s from "fluent-json-schema";
import { idSchema } from "../common.schema";

export const getAllClustersSchema = s.array().items(
    s
        .object()
        .prop("id", idSchema)
        .prop("name", s.string().examples(["BK HPC Laboratory"]))
        .prop("remarks", s.mixed(["string", "null"]))
        .prop("numOfSensors", s.number())
        .prop("numOfActiveSensors", s.number())
);

export type GetAllClusters = Array<{
    id: string;
    name: string;
    remarks: string | null;
    numOfSensors: number;
    numOfActiveSensors: number;
}>;
