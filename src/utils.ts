import { SwaggerControllerTag } from "@constants";
import { FastifyInstance, RouteOptions } from "fastify";

export function swaggerTagRoutes(app: FastifyInstance, routesOptions: RouteOptions[], swaggerTags: SwaggerControllerTag[]) {
    routesOptions.forEach((options) => {
        app.route({
            ...options,
            schema: {
                ...options.schema,
                tags: swaggerTags
            }
        });
    });
}
