import { WsCmd, WSSensorCode } from "@constants";

export interface WSSensorMessage<Type> {
    cmd: WsCmd;
    message: string;
    error: WSSensorCode;
    payload: Type;
}
