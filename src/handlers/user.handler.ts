import { USER_NOT_FOUND } from '@constants';
import { prisma } from '@repositories';
import { GetFilterTemplate, GetUser } from '@schemas/out';
import { FastifyReply, FastifyRequest } from 'fastify';

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

async function getFilterTemplates(): Result<Array<GetFilterTemplate>> {
    return prisma.filterTemplate.findMany();
}

export const usersHandler = {
    getUserById,
    getFilterTemplates
};
