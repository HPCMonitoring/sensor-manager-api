import { SocketStream } from "@fastify/websocket";
import { WsMessage, WsMessageWrap } from "@schemas/out";
import { wlogger } from "@utils";
import { assert } from "console";

export enum LiveStatus {
    DISCONNECTED,
    CONNECTED
}

type PExecutor<T> = {
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
};

const SEQUENCE_BITS = 8;

export class LiveSensor {
    reqResCb: Map<string, PExecutor<any>>;
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
            wlogger.silly(`On ping sensor with id: ${this.id}`);
            this.lastPingTime = new Date();
        });
        this.connection.socket.on("message", (data) => {
            // TODO: need validation here
            wlogger.debug(`On message: id = ${this.id} and message = ${data.toString()}`);
            const messageWrap: WsMessageWrap<any> = JSON.parse(data.toString());
            this.reqResCb.get(messageWrap.coordId)?.resolve({ ...messageWrap });
        });
    }

    send<Type>(message: WsMessage<Type>) {
        const coordId = `${message.cmd}_${this.sequenceNum++ % Math.pow(2, SEQUENCE_BITS)}`;
        const sentData: WsMessageWrap<Type> = {
            ...message,
            coordId: coordId
        };

        this.connection.socket.send(JSON.stringify(sentData), (err) => {
            if (err) {
                this.reqResCb.get(coordId)?.reject(`Command: ${message.cmd} with coorId: ${coordId} send error`);
            }
        });
    }

    sendReqRes<Type>(message: WsMessage<Type>, timeout: number) {
        assert(timeout > 0);

        // TODO: need better approach to generate coordId in case of high load
        const coordId = `${message.cmd}_${this.sequenceNum++ % Math.pow(2, SEQUENCE_BITS)}`;
        const resPromise = new Promise<Type>((resolve, reject) => {
            this.reqResCb.set(coordId, { resolve: resolve, reject: reject });
        });

        const sentData: WsMessageWrap<Type> = {
            ...message,
            coordId: coordId
        };

        this.connection.socket.send(JSON.stringify(sentData), (err) => {
            if (err) {
                this.reqResCb.get(coordId)?.reject(`Command: ${message.cmd} with coorId: ${coordId} send error`);
            }
        });

        const timeoutPromise = new Promise<Type>((_resolve, reject) => {
            setTimeout(() => {
                reject(`Command: ${message.cmd} with coorId: ${coordId} receive response timeout`);
            }, timeout);
        });

        return Promise.race<Type>([resPromise, timeoutPromise]);
    }
}
