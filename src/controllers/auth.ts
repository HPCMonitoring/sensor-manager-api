import { FastifyRequest } from "fastify";

async function getUserById(
    request: FastifyRequest<{
        Body: {
            username: string;
            password: string;
        };
    }>
) {
    request.log.info(request.body);
    return { userId: "1915940", username: "phucvinh" };
}

export const usersController = {
    getUserById
};
