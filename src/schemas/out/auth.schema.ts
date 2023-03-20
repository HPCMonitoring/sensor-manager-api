import { WSSensorCode } from "@constants";
import { idSchema } from "@schemas/common";
import s from "fluent-json-schema";

export const authResultSchema = s.object().prop("id", idSchema).prop("email", s.string());

export type AuthResultDto = {
    id: string;
    email: string;
};

export interface WSAuthMessage {
    id: string;
    message: string;
    error: WSSensorCode;
}
