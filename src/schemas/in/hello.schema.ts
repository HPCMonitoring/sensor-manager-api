import s from "fluent-json-schema";

export const helloSchema = s
    .object()
    .prop("q", s.string().required())
    .prop("type", s.enum(["all", "unread"]).required());
