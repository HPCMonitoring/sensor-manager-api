import { SocketStream } from "@fastify/websocket";
import { SensorSession } from "@interfaces";

export class SensorManagerServer {
    liveSensors: Map<string, SensorSession>;
    constructor() {
        this.liveSensors = new Map();
    }

    onSensorConnect(id: string, connection: SocketStream) {
        connection.socket.on("ping", () => {
            this.onSensorConnect(id, connection);
        });
        this.onSensorPing(id, connection);
    }

    onSensorPing(id: string, connection: SocketStream) {
        const sensor: SensorSession = {
            id: id,
            lastPingTime: new Date(),
            connection: connection
        };
        this.liveSensors.set(sensor.id, sensor);
    }

    getStatus(id: string): SensorConnectionStatus {
        if (!this.liveSensors.has(id)) {
            return "DISCONNECTED";
        }
        const state = this.liveSensors.get(id)?.connection.socket.readyState;
        return state === WebSocket.OPEN ? "CONNECTED" : "DISCONNECTED";
    }
}

export const sensorManager = new SensorManagerServer();
