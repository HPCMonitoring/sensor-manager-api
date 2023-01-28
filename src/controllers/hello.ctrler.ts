import { FastifyReply, FastifyRequest } from "fastify";

export function helloCtrler(_request: FastifyRequest, reply: FastifyReply) {
    return reply.send({
        hello: "world"
    });
}
