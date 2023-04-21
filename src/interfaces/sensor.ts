import { WsCmd, WSSensorCode } from "@constants";

export enum LiveStatus {
    DISCONNECTED,
    CONNECTED
}

export interface IWsMessage<T> {
    cmd: WsCmd;
    message: string;
    error: WSSensorCode;
    payload: T | "{}";
}

export interface IWsMessageWrap<T> extends IWsMessage<T> {
    coordId: string;
}
