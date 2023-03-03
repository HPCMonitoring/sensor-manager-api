import s from "fluent-json-schema";

export const clusterInputSchema = s
    .object()
    .prop("name", s.string().required().examples(["BK HPC"]))
    .prop("remarks", s.mixed(["string", "null"]).examples([null, "Some notes ..."]));

export type ClusterInput = {
    name: string;
    remarks: string | null;
};
