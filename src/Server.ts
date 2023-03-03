import fastify from "fastify";
import type { FastifyCookieOptions } from "@fastify/cookie";
import { COOKIES_SECRET, ENVIRONMENT, loggerConfig, swaggerConfig, swaggerUIConfig } from "@configs";
import { authPlugin, apiPlugin } from "@plugins";
import { ServerConfig } from "@types";

export function createServer(config: ServerConfig) {
    const app = fastify({ logger: loggerConfig[ENVIRONMENT] });

    app.register(import("@fastify/sensible"));
    app.register(import("@fastify/helmet"));
    app.register(import("@fastify/cors"));
    app.register(import("@fastify/cookie"), {
        secret: COOKIES_SECRET, // for cookies signature
        hook: "onRequest"
    } as FastifyCookieOptions);

    // Swagger on production will be turned off in the future
    if (ENVIRONMENT === "development" || ENVIRONMENT === "staging" || ENVIRONMENT === "production") {
        app.register(import("@fastify/swagger"), swaggerConfig);
        app.register(import("@fastify/swagger-ui"), swaggerUIConfig);
    }

    app.register(apiPlugin, { prefix: "/api" });
    app.register(authPlugin, { prefix: "/auth" });

    app.ready().then(() => {
        app.swagger({ yaml: true });
        app.log.info(`Swagger documentation is on http://${config.host}:${config.port}/docs`);
    });

    const listen = () => {
        app.listen(
            {
                host: config.host,
                port: config.port
            },
            function (err) {
                if (err) {
                    app.log.error(err);
                    process.exit(1);
                }
            }
        );
    };

    return {
        ...app,
        listen
    };
}
