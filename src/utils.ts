import { HandlerTag } from "@constants";
import { FastifyInstance, RouteOptions } from "fastify";

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

// const myFormat = winston.format.printf(({ level, message, timestamp }) => {
//     return `${timestamp} [${level}]: ${message}`;
// });

// export const wlogger = winston.createLogger({
//     level: "debug",
//     format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), myFormat),
//     defaultMeta: { service: "user-service" },
//     transports: [
//         new winston.transports.File({ filename: "error.log", level: "error" }),
//         new winston.transports.File({ filename: "combined.log" })
//     ]
// });

// if (process.env.NODE_ENV !== "production") {
//     wlogger.add(new winston.transports.Console());
// }
