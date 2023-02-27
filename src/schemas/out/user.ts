import s from "fluent-json-schema";

export const userSchema = s.object().prop("id", s.string()).prop("email", s.string()).prop("name", s.string());
