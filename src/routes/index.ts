import { FastifyInstance } from "fastify";
import { userRoute } from "./user.route";

export async function routes(app: FastifyInstance) {
    app.register(userRoute, { prefix: "/users" });
}
