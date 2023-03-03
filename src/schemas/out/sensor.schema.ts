import { SensorStatus } from "@prisma/client";
import { nullable } from "@schemas/common";
import s from "fluent-json-schema";

export const getAllSensorsSchema = s.array().items(
    s
        .object()
        .prop("id", s.string())
        .prop("name", s.string())
        .prop("ipAddr", s.string())
        .prop("remarks", s.string().raw(nullable))
        .prop("status", s.string().enum(Object.values(SensorStatus)))
);

export type GetAllSensors = Array<{
    id: string;
    name: string;
    ipAddr: string;
    remarks: string | null;
    status: SensorStatus;
}>;
