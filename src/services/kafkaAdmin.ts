import { KAFKA_CLIENT_ID } from "@constants";
import { Kafka } from "kafkajs";

const kafkaClient = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: ["localhost:9092"]
});

const admin = kafkaClient.admin();
admin.connect().then(() => {
    console.log("Kakfa admin created !");
});

export const kafkaAdmin = admin;
