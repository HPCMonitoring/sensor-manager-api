import { FastifyRequest } from "fastify";

async function login(
    request: FastifyRequest<{
        Body: {
            username: string;
            password: string;
        };
    }>
) {
    request.log.info(request.body);
    return {
        userId: "1915940",
        username: "phucvinh"
    };
}

export const authCtrler = {
    login
};
