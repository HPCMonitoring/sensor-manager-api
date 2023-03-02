import { SwaggerControllerTag } from "@constants";
import { usersCrtler } from "@controllers";
import { verifyToken } from "@middlewares/auth";
import { userIdSchema } from "@schemas/in";
import { userSchema } from "@schemas/out";
import { swaggerTagRoutes } from "@utils";
import { FastifyInstance, RouteOptions } from "fastify";

export async function userRoute(app: FastifyInstance) {
    app.addHook("onRequest", verifyToken);
    const routesOptions: RouteOptions[] = [
        {
            method: "GET",
            url: "/:userId",
            schema: {
                params: userIdSchema,
                response: {
                    200: userSchema
                }
            },
            handler: usersCrtler.getUserById
        }
    ];

    // Tag route to a controllerName
    const swaggerTags = [SwaggerControllerTag.HELLO];
    swaggerTagRoutes(app, routesOptions, swaggerTags);
}
