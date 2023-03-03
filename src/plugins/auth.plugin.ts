import { SwaggerControllerTag } from "@constants";
import { authCtrler } from "@controllers";
import { authInputSchema } from "@schemas/in";
import { authResultSchema } from "@schemas/out";
import { swaggerTagRoutes } from "@utils";
import { FastifyInstance, RouteOptions } from "fastify";

export async function authPlugin(app: FastifyInstance) {
    const routesOptions: RouteOptions[] = [
        {
            method: "POST",
            url: "/login",
            schema: {
                body: authInputSchema,
                response: {
                    200: authResultSchema
                }
            },
            handler: authCtrler.login
        },
        {
            method: "POST",
            url: "/signup",
            schema: {
                body: authInputSchema,
                response: {
                    200: authResultSchema
                }
            },
            handler: authCtrler.signup
        }
    ];

    // Tag route to a controllerName
    const swaggerTags = [SwaggerControllerTag.AUTH];
    swaggerTagRoutes(app, routesOptions, swaggerTags);
}
