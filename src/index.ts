import { ENVIRONMENT } from "@configs/env";
import { ScriberConfig, sensorScriber } from "@services";
import { createServer } from "./Server";

const PORT = 8080;

// DO NOT modify, it is used to resolve port mapping when deploy.
const HOST = ENVIRONMENT === "development" ? "localhost" : "0.0.0.0";

// Setup and start fastify server
const app = createServer({
    host: HOST,
    port: PORT
});

// Setup and start sensor scriber
const KAFKA_BROKER = process.env.KAFKA_BROKER || "localhost:9092";
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || "hello-world-topic";
const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID || "hpc-monitoring";
const ES_CERT_PATH = process.env.ES_CERT_PATH || "ca.crt";
const ES_HOST = process.env.ES_HOST || "https://localhost:9200";
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "100");
const LINGER_MS = parseInt(process.env.LINGER_MS || "1000");
const ES_USERNAME = process.env.ES_USERNAME || "elastic";
const ES_PASSWORD = process.env.ES_PASSWORD || "abcdef";
const ES_INDEX = process.env.ES_INDEX || "sensor-data";

const scriberConfig: ScriberConfig = {
    batchSize: BATCH_SIZE,
    lingerMs: LINGER_MS,
    kafkaBrodker: KAFKA_BROKER,
    kafkaTopic: KAFKA_TOPIC,
    kafkaGroupId: KAFKA_GROUP_ID,
    esCertPath: ES_CERT_PATH,
    esHost: ES_HOST,
    esUserName: ES_USERNAME,
    esPasswd: ES_PASSWORD,
    esIndex: ES_INDEX
};

sensorScriber.setConfig(scriberConfig);
sensorScriber.startScriber();

app.listen();
