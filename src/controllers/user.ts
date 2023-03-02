import { USER_NOT_FOUND } from "@constants";
import { prisma } from "@repositories";
import { FastifyReply, FastifyRequest } from "fastify";

async function getUserById(request: FastifyRequest<{ Headers: { userId: string } }>, reply: FastifyReply) {
    const userId: string = request.headers.userId;
    const user = prisma.user.findUnique({
        select: {
            id: true,
            email: true
        },
        where: { id: userId }
    });
    if (!user) return reply.badRequest(USER_NOT_FOUND);
    return user;
}

export const usersCrtler = {
    getUserById
};
