import s from "fluent-json-schema";

export const getUserSchema = s.object().prop("id", s.string()).prop("email", s.string());

export type GetUser = {
    id: string;
    email: string;
};
