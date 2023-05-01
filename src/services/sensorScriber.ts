import { Consumer, Kafka } from "kafkajs";
import { Client } from "@elastic/elasticsearch";
import { readFileSync } from "fs";

const LOG_CONTEXT = "Scriber";

export type ScriberConfig = {
    batchSize: number;
    lingerMs: number;
    kafkaBrodker: string;
    kafkaTopic: string;
    kafkaGroupId: string;
    esCertPath: string;
    esHost: string;
    esUserName: string;
    esPasswd: string;
    esIndex: string;
};

class KafkaScriber {
    sensorStats: object[];
    config: ScriberConfig | undefined;
    esClient: Client;
    kafkaConsumer: Consumer;

    constructor() {
        this.sensorStats = [];
    }

    async setConfig(config: ScriberConfig) {
        this.config = config;
    }

    async startScriber() {
        if (!this.config) {
            global.logger.error(`[${LOG_CONTEXT}] Scriber config is not set`);
            return;
        }

        this.esClient = new Client({
            node: this.config.esHost,
            auth: {
                username: this.config.esUserName,
                password: this.config.esPasswd
            },
            tls: {
                ca: readFileSync(this.config.esCertPath),
                rejectUnauthorized: false
            }
        });

        const kafka = new Kafka({
            brokers: [this.config.kafkaBrodker]
        });

        this.kafkaConsumer = kafka.consumer({ groupId: this.config.kafkaGroupId });

        await this.kafkaConsumer.connect();
        await this.kafkaConsumer.subscribe({ topic: this.config.kafkaTopic, fromBeginning: false });

        this.startLingerCheck();

        await this.kafkaConsumer.run({
            eachMessage: async ({ message }) => {
                if (!message.value) return;
                this.sensorStats.push(JSON.parse(message.value.toString()));
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                if (this.sensorStats.length >= this.config!.batchSize) {
                    const statsToSent = this.sensorStats.splice(0, this.sensorStats.length);
                    this.doSaveStat(statsToSent);
                }
            }
        });
    }

    startLingerCheck() {
        setInterval(async () => {
            if (this.sensorStats.length > 0) {
                const messageToSent = this.sensorStats.splice(0, this.sensorStats.length);
                this.doSaveStat(messageToSent);
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        }, this.config!.lingerMs);
    }

    async doSaveStat(stats: object[]) {
        global.logger.info(`[${LOG_CONTEXT}] going to index ${stats.length} items in to elastisearch`);
        const now = new Date();
        const operations = stats.flatMap((doc) => [{ index: { _index: this.config?.esIndex } }, { ...doc, ts: now.toISOString() }]);
        this.esClient
            .bulk({
                refresh: true,
                operations
            })
            .then(() => {
                global.logger.info(`[${LOG_CONTEXT}] index ${stats.length} items succesfully`);
            })
            .catch((err) => {
                global.logger.error(`[${LOG_CONTEXT}] fail to index ${stats.length} items with error message ${err}`);
            });
    }
}

export const sensorScriber = new KafkaScriber();
