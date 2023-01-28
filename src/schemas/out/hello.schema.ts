import s from "fluent-json-schema";

export const helloOutputSchema = s.object().prop("hello", s.string());
