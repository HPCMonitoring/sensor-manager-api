import { WsCmd, WSSensorCode } from "@constants";

export interface WsMessage<Type> {
    cmd: WsCmd;
    message: string;
    error: WSSensorCode;
    payload: Type | "{}";
}

export interface WsMessageWrap<Type> extends WsMessage<Type> {
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
