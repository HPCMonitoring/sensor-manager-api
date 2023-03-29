import { HandlerTag } from "@constants";
import { FastifyInstance, RouteOptions } from "fastify";
import winston from "winston";

export function createPlugin(swaggerTags: HandlerTag[], routesOptions: RouteOptions[]) {
    return async function (app: FastifyInstance) {
        routesOptions.forEach((options) => {
            app.route({
                ...options,
                schema: {
                    ...options.schema,
                    tags: swaggerTags
                }
            });
        });
    };
}
const LOG_DIR = "logs/";
const myFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

export const wlogger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), myFormat),
    defaultMeta: { service: "user-service" },
    transports: [
        new winston.transports.File({ filename: LOG_DIR + "error.log", level: "error", maxFiles: 5, maxsize: 10_000_000 }),
        new winston.transports.File({ filename: LOG_DIR + "debug.log", level: "debug", maxFiles: 10, maxsize: 10_000_000 }),
        new winston.transports.File({ filename: LOG_DIR + "trace.log", level: "silly", maxFiles: 30, maxsize: 10_000_000 })
    ]
});

if (process.env.NODE_ENV !== "production") {
    wlogger.add(new winston.transports.Console());
}
