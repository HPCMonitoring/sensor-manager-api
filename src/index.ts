import fastify from "fastify";
import { ENVIRONMENT, loggerConfig, swaggerConfig, swaggerUIConfig } from "@configs";

import { routes } from "./routes";

const PORT = 8080;

const app = fastify({ logger: loggerConfig[ENVIRONMENT] });

app.register(import("@fastify/swagger"), swaggerConfig);
app.register(import("@fastify/swagger-ui"), swaggerUIConfig);
app.register(routes, { prefix: "/api" });

app.ready().then(() => app.swagger({ yaml: true }));

app.listen({ port: PORT }, function (err) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});
