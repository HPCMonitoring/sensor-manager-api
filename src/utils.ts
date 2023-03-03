import { SwaggerControllerTag } from "@constants";
import { FastifyInstance, RouteOptions } from "fastify";

export function createPlugin(swaggerTags: SwaggerControllerTag[], routesOptions: RouteOptions[]) {
    return async function (app: FastifyInstance) {
        routesOptions.forEach((options) => {
            app.route({
                ...options,
                schema: {
                    ...options.schema,
                    tags: swaggerTags
                }
            });
        });
    };
}
