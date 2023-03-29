import { SocketStream } from "@fastify/websocket";

export interface SensorSession {
    id: string;
    lastPingTime: Date;
    connection: SocketStream;
}
