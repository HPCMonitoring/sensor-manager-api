import { idSchema } from "@schemas/common";
import s from "fluent-json-schema";

export const authResultSchema = s
    .object()
    .prop("id", idSchema)
    .prop("email", s.string().examples(["npvinh0507@gmail.com"]));

export type AuthOutput = {
    id: string;
    email: string;
};
