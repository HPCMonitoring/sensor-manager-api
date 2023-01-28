import { SwaggerTag } from "@constants";
import { helloCtrler } from "@controllers";
import { helloSchema } from "@schemas/in";
import { helloOutputSchema } from "@schemas/out";
import { FastifyInstance, RouteOptions } from "fastify";

export async function helloRoute(app: FastifyInstance) {
    const routes: RouteOptions[] = [
        {
            method: "GET",
            url: "/",
            schema: {
                querystring: helloSchema,
                response: {
                    200: helloOutputSchema
                }
            },
            handler: helloCtrler
        }
    ];
    routes.forEach((route) =>
        app.route({
            ...route,
            schema: {
                ...route.schema,
                tags: [SwaggerTag.HELLO]
            }
        })
    );
}
