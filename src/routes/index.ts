import { FastifyInstance } from "fastify";
import { authRoute } from "./auth";
import { userRoute } from "./user";

export async function apiRoutes(app: FastifyInstance) {
    app.register(userRoute, { prefix: "/users" });
}

export async function authRoutes(app: FastifyInstance) {
    app.register(authRoute);
}
