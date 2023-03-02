import { FastifyError, FastifyLoggerOptions } from "fastify";
import { PinoLoggerOptions } from "fastify/types/logger";
import { Environment } from "@types";

const errorSerialize = (err: FastifyError) => {
    return {
        type: err.name,
        stack: err.statusCode && err.statusCode >= 500 && err.stack ? err.stack : "null",
        message: err.message,
        statusCode: err.statusCode
    };
};

export const loggerConfig: Record<Environment, boolean | (FastifyLoggerOptions & PinoLoggerOptions)> = {
    development: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "dd/mm/yy HH:MM:ss",
                ignore: "pid,hostname"
            }
        },
        serializers: { err: errorSerialize }
    },
    staging: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "dd/mm/yy HH:MM:ss",
                ignore: "pid,hostname"
            }
        },
        serializers: { err: errorSerialize }
    },
    production: { serializers: { err: errorSerialize } },
    test: false
};
