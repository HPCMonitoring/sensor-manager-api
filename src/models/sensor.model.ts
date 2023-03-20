import { SocketStream } from "@fastify/websocket";

export enum LiveStatus {
    DISCONNECTED,
    CONNECTED
}

export interface LiveSensor {
    id: string;
    lastPingTime: Date;
    connection: SocketStream;
}
