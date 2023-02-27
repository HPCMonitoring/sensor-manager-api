import { MIN_USERNAME_LENGTH, MIN_PASSWORD_LENGTH } from "@constants";
import s from "fluent-json-schema";

export const loginSchema = s
    .object()
    .prop("username", s.string().required().minLength(MIN_USERNAME_LENGTH).examples(["phucvinh"]))
    .prop("password", s.string().required().minLength(MIN_PASSWORD_LENGTH).examples(["@%!Fjhiuqwb^3"]));
