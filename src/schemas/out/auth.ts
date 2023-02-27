import s from "fluent-json-schema";

export const loginResultSchema = s
    .object()
    .prop("userId", s.string().examples(["1915940"]))
    .prop("username", s.string().examples(["phucvinh"]));
