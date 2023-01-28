import { helloCtrler } from "@controllers";
import { helloSchema } from "@schemas/in";
import { helloOutputSchema } from "@schemas/out";
import { FastifyInstance } from "fastify";

export async function helloRoute(fastify: FastifyInstance) {
    fastify.route({
        method: "GET",
        url: "/",
        schema: {
            querystring: helloSchema,
            response: {
                200: helloOutputSchema
            }
        },
        handler: helloCtrler
    });
}
