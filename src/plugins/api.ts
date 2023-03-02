import { SwaggerControllerTag } from "@constants";
import { usersCrtler } from "@controllers";
import { verifyToken } from "@middlewares/auth";
import { userSchema } from "@schemas/out";
import { swaggerTagRoutes } from "@utils";
import { FastifyInstance, RouteOptions } from "fastify";

async function userPlugin(app: FastifyInstance) {
    app.addHook("onRequest", verifyToken);
    const routesOptions: RouteOptions[] = [
        {
            method: "GET",
            url: "",
            schema: {
                response: {
                    200: userSchema
                }
            },
            handler: usersCrtler.getUserById
        }
    ];

    // Tag route to a controllerName
    const swaggerTags = [SwaggerControllerTag.USER];
    swaggerTagRoutes(app, routesOptions, swaggerTags);
}

export async function apiPlugin(app: FastifyInstance) {
    app.register(userPlugin, { prefix: "/user" });
}
