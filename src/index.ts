import fastify from "fastify";
import { ENVIRONMENT, loggerConfig } from "@configs";
import { routes } from "./routes";

const PORT = 8080;

const app = fastify({ logger: loggerConfig[ENVIRONMENT] });

app.register(routes, { prefix: "/api" });

app.listen({ port: PORT }, function (err) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});
