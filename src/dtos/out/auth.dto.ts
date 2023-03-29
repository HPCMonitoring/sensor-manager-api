import { idSchema } from "src/dtos/common.schema";
import s from "fluent-json-schema";

export const authResultSchema = s.object().prop("id", idSchema).prop("email", s.string());

export type AuthResultDto = {
    id: string;
    email: string;
};
