import { ID_LENGTH, MIN_INTERVAL } from "@constants";
import { nullable } from "@dtos/common";
import s from "fluent-json-schema";

const kafkaJobSchema = s
    .object()
    .prop("usingTemplateId", s.string().minLength(ID_LENGTH).maxLength(ID_LENGTH).raw(nullable))
    .prop("script", s.string().required())
    .prop("brokerUrl", s.string().required())
    .prop("topicName", s.string().required())
    .prop("interval", s.number().required().minimum(MIN_INTERVAL));

type KafkaJob = {
    usingTemplateId: string | null;
    brokerUrl: string;
    topicName: string;
    script: string;
    interval: number;
};

export const updateSensorSchema = s
    .object()
    .prop("name", s.string().required())
    .prop("remarks", s.string().raw(nullable))
    .prop("kafkaJobs", s.array().required().items(kafkaJobSchema));

export type UpdateSensorDto = {
    name: string;
    remarks: string | null;
    kafkaJobs: KafkaJob[];
};
