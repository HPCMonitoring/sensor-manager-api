import { nullable } from "@dtos/common";
import s from "fluent-json-schema";

export const clusterMutationSchema = s.object().prop("name", s.string().required()).prop("remarks", s.string().raw(nullable));

export type ClusterMutationDto = {
    name: string;
    remarks: string | null;
};
