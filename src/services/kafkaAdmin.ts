import { KAFKA_CLIENT_ID } from "@constants";
import { Kafka } from "kafkajs";

const kafkaClient = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: ["localhost:9092"]
});

export const kafkaAdmin = kafkaClient.admin();
