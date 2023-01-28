import { FastifyLoggerOptions } from "fastify";
import { PinoLoggerOptions } from "fastify/types/logger";
import { Environment } from "@types";

export const loggerConfig: Record<Environment, boolean | (FastifyLoggerOptions & PinoLoggerOptions)> = {
    development: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname"
            }
        }
    },
    staging: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname"
            }
        }
    },
    production: true,
    test: false
};
