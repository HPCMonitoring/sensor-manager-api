import fastify from "fastify";
import { ENVIRONMENT, loggerConfig, swaggerConfig, swaggerUIConfig } from "@configs";

import { apiRoutes, authRoutes } from "./routes";

const PORT = 8080;
const HOST = ENVIRONMENT === "development" ? "localhost" : "0.0.0.0"; // DO NOT modify, it is used to resolve port mapping when deploy.

const app = fastify({ logger: loggerConfig[ENVIRONMENT] });

// Swagger on production will be turned off in the future
if (ENVIRONMENT === "development" || ENVIRONMENT === "staging" || ENVIRONMENT === "production") {
    app.register(import("@fastify/swagger"), swaggerConfig);
    app.register(import("@fastify/swagger-ui"), swaggerUIConfig);
}

app.register(apiRoutes, { prefix: "/api" });
app.register(authRoutes, { prefix: "/auth" });

app.ready().then(() => app.swagger({ yaml: true }));

app.listen({ host: HOST, port: PORT }, function (err) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});
