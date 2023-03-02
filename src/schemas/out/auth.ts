import s from "fluent-json-schema";
import { idSchema } from "../common";

export const loginResultSchema = s
    .object()
    .prop("id", idSchema)
    .prop("email", s.string().examples(["npvinh0507@gmail.com"]));
