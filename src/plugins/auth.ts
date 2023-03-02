import { SwaggerControllerTag } from "@constants";
import { authCtrler } from "@controllers";
import { loginSchema } from "@schemas/in";
import { loginResultSchema } from "@schemas/out";
import { swaggerTagRoutes } from "@utils";
import { FastifyInstance, RouteOptions } from "fastify";

export async function authPlugin(app: FastifyInstance) {
    const routesOptions: RouteOptions[] = [
        {
            method: "POST",
            url: "/login",
            schema: {
                body: loginSchema,
                response: {
                    200: loginResultSchema
                }
            },
            handler: authCtrler.login
        }
    ];

    // Tag route to a controllerName
    const swaggerTags = [SwaggerControllerTag.AUTH];
    swaggerTagRoutes(app, routesOptions, swaggerTags);
}
