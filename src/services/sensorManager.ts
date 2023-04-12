import { WSCloseCode, WsCmd, WSSensorCode, WS_COMMON_TIMEOUT } from "@constants";
import { SocketStream } from "@fastify/websocket";
import { IWsMessage, IWsMessageWrap } from "@interfaces";
import { assert } from "console";
import WebSocket from "ws";
import { filterGenerator } from "./sensorConfigParser";

type PExecutor<T = unknown> = {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
};

const SEQUENCE_BITS = 8;

export class LiveSensor {
    reqResCb: Map<string, PExecutor>;
    id: string;
    lastPingTime: Date;
    connection: SocketStream;
    sequenceNum: number;

    constructor(id: string, connection: SocketStream) {
        this.id = id;
        this.connection = connection;
        this.lastPingTime = new Date();
        this.reqResCb = new Map();
        this.sequenceNum = 0;
        this.setup();
    }

    private setup() {
        this.connection.socket.on("ping", () => {
            global.logger.info(`On ping sensor with id: ${this.id}`);
            this.lastPingTime = new Date();
        });
        this.connection.socket.on("message", (data) => {
            // TODO: need validation here
            global.logger.debug(`On message: id = ${this.id} and message = ${data.toString()}`);
            const messageWrap: IWsMessageWrap<unknown> = JSON.parse(data.toString());
            this.reqResCb.get(messageWrap.coordId)?.resolve({ ...messageWrap });
            this.reqResCb.delete(messageWrap.coordId);
        });
    }

    send<T>(message: IWsMessage<T>) {
        const coordId = `${message.cmd}_${this.sequenceNum++ % Math.pow(2, SEQUENCE_BITS)}`;
        const sentData: IWsMessageWrap<T> = {
            ...message,
            coordId: coordId
        };

        return new Promise<undefined>((resolve, reject) => {
            this.connection.socket.send(JSON.stringify(sentData), (err) => {
                if (err) {
                    reject(`Command: ${message.cmd} with coorId: ${coordId} send error`);
                } else {
                    resolve(undefined);
                }
            });
        });
    }

    sendReqRes<T>(message: IWsMessage<T>, timeout: number) {
        assert(timeout > 0);

        // TODO: need better approach to generate coordId in case of high load
        const coordId = `${message.cmd}_${this.sequenceNum++ % Math.pow(2, SEQUENCE_BITS)}`;
        const resPromise = new Promise<T>((resolve, reject) => {
            this.reqResCb.set(coordId, { resolve: resolve, reject: reject });
        });

        const sentData: IWsMessageWrap<T> = {
            ...message,
            coordId: coordId
        };

        this.connection.socket.send(JSON.stringify(sentData), (err) => {
            if (err) {
                this.reqResCb.get(coordId)?.reject(`Command: ${message.cmd} with coorId: ${coordId} send error`);
            }
        });

        const timeoutPromise = new Promise<T>((_resolve, reject) => {
            setTimeout(() => {
                reject(`Command: ${message.cmd} with coorId: ${coordId} receive response timeout`);
                this.reqResCb.delete(coordId);
            }, timeout);
        });

        return Promise.race<T>([resPromise, timeoutPromise]);
    }

    close(code: WSCloseCode, message: string) {
        this.connection.socket.close(code, message);
    }
}

export class SensorManagerServer {
    liveSensors: Map<string, LiveSensor>;
    constructor() {
        this.liveSensors = new Map();
    }

    onSensorConnect(liveSensor: LiveSensor) {
        this.liveSensors.set(liveSensor.id, liveSensor);
    }

    getStatus(sensorId: string): SensorConnectionStatus {
        if (!this.liveSensors.has(sensorId)) {
            return "DISCONNECTED";
        }
        const state = this.liveSensors.get(sensorId)?.connection.socket.readyState;
        return state === WebSocket.OPEN ? "RUNNING" : "DISCONNECTED";
    }

    sendConfig(sensorId: string, configs: SensorConfig[]) {
        const topicPayloads: WsTopicPayload[] = configs.map((c) => ({
            interval: c.interval,
            broker: c.broker,
            topicName: c.topicName,
            type: c.script.type,
            fields: c.script.fields as Record<string, string>,
            prefixCommand: "filters" in c.script ? filterGenerator.toPrefix(c.script.filters) : ""
        }));

        const message: IWsMessage<WsConfigPayload> = {
            cmd: WsCmd.CONFIG,
            message: "",
            error: WSSensorCode.SUCCESS,
            payload: {
                topics: topicPayloads
            }
        };

        const liveSensor = this.liveSensors.get(sensorId);
        if (liveSensor) return liveSensor.sendReqRes(message, WS_COMMON_TIMEOUT);
        else throw new Error(`Sensor with id = ${sensorId} has not registered to manager`);
    }
}

export const sensorManager = new SensorManagerServer();
