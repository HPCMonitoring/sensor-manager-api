import { ID_LENGTH } from "@constants";
import s from "fluent-json-schema";

export const idDefinition = s.string().required().minLength(ID_LENGTH).maxLength(ID_LENGTH);
export const userIdSchema = s.object().prop("userId", idDefinition);
