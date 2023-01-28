import createError from "@fastify/error";
import { errorCodes } from "fastify";

export const BadRequest = createError(errorCodes.FST_ERR_SCH_VALIDATION_BUILD().code, "%s", 400);
