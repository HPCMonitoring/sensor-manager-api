import createError from "@fastify/error";

export const BadRequest = createError("FST_ERR_REQ_INVALID_VALIDATION_INVOCATION", "%s");
