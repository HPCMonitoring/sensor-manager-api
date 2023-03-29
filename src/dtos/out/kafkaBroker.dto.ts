import { idSchema } from "src/dtos/common.schema";
import s from "fluent-json-schema";

export const kafkaTopicSchema = s.object().prop("id", idSchema).prop("name", s.string());

export type KafkaTopicDto = {
    id: string;
    name: string;
};

export const kafkaBrokerSchema = s
    .object()
    .prop("id", idSchema)
    .prop("name", s.string())
    .prop("url", s.string())
    .prop("topics", s.array().items(kafkaTopicSchema));

export type KafkaBrokerDto = {
    id: string;
    name: string;
    url: string;
    topics: KafkaTopicDto[];
};
