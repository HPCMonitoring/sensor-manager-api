import { SwaggerControllerTag } from "@constants";
import { usersController } from "@controllers";
import { userIdSchema } from "@schemas/in";
import { userSchema } from "@schemas/out";
import { swaggerTagRoutes } from "@utils";
import { FastifyInstance, RouteOptions } from "fastify";

export async function userRoute(app: FastifyInstance) {
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
            handler: usersController.getUserById
        }
    ];

    // Tag route to a controllerName
    const swaggerTags = [SwaggerControllerTag.HELLO];
    swaggerTagRoutes(app, routesOptions, swaggerTags);
}
