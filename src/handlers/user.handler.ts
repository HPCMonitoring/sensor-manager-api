import { USER_NOT_FOUND } from "@constants";
import { prisma } from "@repositories";
import { GetUser } from "@schemas/out";
import { Result } from "@types";
import { FastifyReply, FastifyRequest } from "fastify";

async function getUserById(request: FastifyRequest<{ Headers: { userId: string } }>, reply: FastifyReply): Result<GetUser> {
    const userId: string = request.headers.userId;
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            email: true
        },
        where: { id: userId }
    });
    if (user === null) return reply.badRequest(USER_NOT_FOUND);
    return user;
}

export const usersHandler = {
    getUserById
};
