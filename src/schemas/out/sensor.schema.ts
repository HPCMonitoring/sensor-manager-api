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

const subscribingTopicSchema = s
    .object()
    .prop("id", idSchema)
    .prop("key", idSchema.description("ID of configuration"))
    .prop("name", s.string())
    .prop("interval", s.number())
    .prop("usingTemplate", s.object().raw(nullable).prop("id", idSchema).prop("name", s.string()))
    .prop("script", s.string())
    .prop("broker", s.object().prop("id", idSchema).prop("name", s.string()).prop("url", s.string()));

type SubscribingTopicDto = {
    key: string;
    id: string;
    name: string;
    interval: number;
    usingTemplate: {
        id: string;
        name: string;
    } | null;
    script: string;
    broker: {
        id: string;
        name: string;
        url: string;
    };
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
    .prop("state", s.enum(allSensorStates))
    .prop("subscribingTopics", s.array().items(subscribingTopicSchema));

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
    state: SensorState;
    subscribingTopics: SubscribingTopicDto[];
};
