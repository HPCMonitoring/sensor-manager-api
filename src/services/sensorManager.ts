import { LiveSensor, LiveStatus } from "@models";

export class SensorManagerServer {
    liveSensors: Map<string, LiveSensor>;
    constructor() {
        this.liveSensors = new Map();
    }

    onSensorConnect(liveSensor: LiveSensor) {
        this.liveSensors.set(liveSensor.id, liveSensor);
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
