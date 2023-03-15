import { idSchema, nullable } from "@schemas/common";
import s from "fluent-json-schema";

const allSensorStates: SensorState[] = ["RUNNING", "STOPPED", "DISCONNECTED", "REQUESTED"];

export const sensorSummarySchema = s
    .object()
    .prop("id", s.string())
    .prop("name", s.string())
    .prop("ipAddr", s.string())
    .prop("remarks", s.string().raw(nullable))
    .prop("state", s.enum(allSensorStates));

export type SensorSummaryDto = {
    id: string;
    name: string;
    ipAddr: string;
    remarks: string | null;
    state: SensorState;
};

export const sensorDetailSchema = s
    .object()
    .prop("id", s.string())
    .prop("name", s.string())
    .prop("ipAddr", s.string())
    .prop("remarks", s.string().raw(nullable))
    .prop("kernelName", s.string())
    .prop("kernelVersion", s.string())
    .prop("arch", s.string())
    .prop("hostname", s.string())
    .prop("rootUser", s.string())
    .prop(
        "subscribingTopics",
        s
            .array()
            .items(
                s
                    .object()
                    .prop("id", idSchema)
                    .prop("name", s.string())
                    .prop("interval", s.number())
                    .prop("usingTemplateId", s.string().raw(nullable))
                    .prop("script", s.string())
                    .prop("brokerId", s.string())
                    .prop("brokerName", s.string())
            )
    );
export type SensorDetailDto = {
    id: string;
    name: string;
    ipAddr: string;
    remarks: string | null;
    kernelName: string;
    kernelVersion: string;
    arch: string;
    hostname: string;
    rootUser: string;
    subscribingTopics: Array<{
        id: string;
        name: string;
        interval: number;
        usingTemplateId: string | null;
        script: string;
        brokerId: string;
        brokerName: string;
    }>;
};
