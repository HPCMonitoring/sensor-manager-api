import { SocketStream } from "@fastify/websocket";
import { LiveSensor, LiveStatus } from "@models";

export class SensorManagerServer {
    liveSensors: Map<string, LiveSensor>;
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
        const sensor: LiveSensor = {
            id: id,
            lastPingTime: new Date(),
            connection: connection
        };
        this.liveSensors.set(sensor.id, sensor);
    }

    getStatus(id: string): LiveStatus {
        if (!this.liveSensors.has(id)) {
            return LiveStatus.DISCONNECTED;
        }
        const state = this.liveSensors.get(id)?.connection.socket.readyState;
        return state === WebSocket.OPEN ? LiveStatus.CONNECTED : LiveStatus.DISCONNECTED;
    }
}

export const sensorManager = new SensorManagerServer();
