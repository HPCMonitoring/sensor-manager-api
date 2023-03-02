import { FastifyReply, FastifyRequest } from "fastify";
import { compare } from "bcrypt";
import { prisma } from "@repositories";
import { LOGIN_FAIL, USER_NOT_FOUND } from "@constants";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@configs";

async function login(
    request: FastifyRequest<{
        Body: {
            email: string;
            password: string;
        };
    }>,
    reply: FastifyReply
) {
    const user = await prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            password: true
        },
        where: { email: request.body.email }
    });
    if (!user) return reply.badRequest(USER_NOT_FOUND);

    const correctPassword = await compare(request.body.password, user.password);
    if (!correctPassword) return reply.badRequest(LOGIN_FAIL);

    const userToken = jwt.sign({ userId: user.id }, JWT_SECRET);
    reply.setCookie("userId", userToken);

    return {
        id: user.id,
        email: user.email
    };
}

export const authCtrler = {
    login
};
