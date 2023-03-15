import { idSchema } from "@schemas/common";
import s from "fluent-json-schema";

export const filterTemplateSchema = s
    .object()
    .prop("id", idSchema)
    .prop("name", s.string())
    .prop("remarks", s.string().raw({ nullable: true }))
    .prop("script", s.string())
    .prop("interval", s.number());

export type FilterTemplateDto = {
    id: string;
    script: string;
    name: string;
    remarks: string | null;
    interval: number;
};
