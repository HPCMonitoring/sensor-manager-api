import { idSchema, nullable } from "@dtos/common";
import s from "fluent-json-schema";

export const filterTemplateSchema = s
    .object()
    .prop("id", idSchema)
    .prop("name", s.string())
    .prop("remarks", s.string().raw(nullable))
    .prop("script", s.string())
    .prop("interval", s.number());

export type FilterTemplateDto = {
    id: string;
    script: string;
    name: string;
    remarks: string | null;
    interval: number;
};
