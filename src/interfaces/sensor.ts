import { WsCmd, WSSensorCode } from "@constants";

export enum LiveStatus {
    DISCONNECTED,
    CONNECTED
}

export interface WsMessage<T> {
    cmd: WsCmd;
    message: string;
    error: WSSensorCode;
    payload: T | "{}";
}

export interface WsMessageWrap<T> extends WsMessage<T> {
    coordId: string;
}

export interface WSAuthPayload {
    id: string;
}

export interface WsSysInfoPayload {
    kernelName: string;
    kernelVersion: string;
    arch: string;
    hostname: string;
    rootUser: string;
}

export interface SensorConfig {
    broker: string;
    topicName: string;
    interval: number;
    script: ConfigScriptAST;
}

export interface WsTopicPayload {
    broker: string;
    topicName: string;
    interval: number;
    type: string;
    fields: Record<string, string>;
    prefixCommand: string;
}

export interface WsConfigPayload {
    topics: WsTopicPayload[];
}
