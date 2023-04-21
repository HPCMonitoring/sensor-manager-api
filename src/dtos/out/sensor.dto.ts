import { idSchema, nullable } from "@dtos/common";
import s from "fluent-json-schema";

const allSensorStates: SensorActionStatus[] = ["RUNNING", "STOPPED", "REQUESTED"];

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
    state: SensorConnectionStatus;
};

const kafkaJobSchema = s
    .object()
    .prop("id", idSchema)
    .prop("brokerUrl", s.string())
    .prop("topicName", s.string())
    .prop("interval", s.number())
    .prop("script", s.string())
    .prop("usingTemplate", s.object().raw(nullable).prop("id", idSchema).prop("name", s.string()));

type KafkaJobDto = {
    id: string;
    brokerUrl: string;
    topicName: string;
    interval: number;
    script: string;
    usingTemplate: {
        id: string;
        name: string;
    } | null;
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
    .prop("kafkaJobs", s.array().items(kafkaJobSchema));

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
    state: SensorConnectionStatus;
    kafkaJobs: KafkaJobDto[];
};
