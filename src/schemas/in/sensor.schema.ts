import { ID_LENGTH, MIN_INTERVAL } from "@constants";
import { idSchema } from "@schemas/common";
import s from "fluent-json-schema";

const subscribeTopic = s
    .object()
    .prop("id", idSchema.required())
    .prop("usingTemplateId", s.string().minLength(ID_LENGTH).maxLength(ID_LENGTH).raw({ nullable: true }))
    .prop("script", s.string().required())
    .prop("interval", s.number().required().minimum(MIN_INTERVAL));

type SubscribeTopicDto = {
    id: string;
    usingTemplateId: string | null;
    script: string;
    interval: number;
};

export const updateSensorSchema = s
    .object()
    .prop("name", s.string().required())
    .prop("remarks", s.string().raw({ nullable: true }))
    .prop("subscribeTopics", s.array().required().items(subscribeTopic));

export type UpdateSensorDto = {
    name: string;
    remarks: string | null;
    subscribeTopics: SubscribeTopicDto[];
};
