import { FastifyInstance } from "fastify";
import { helloRoute } from "./hello.route";

export async function routes(app: FastifyInstance) {
    app.register(helloRoute, { prefix: "/hello" });
}
