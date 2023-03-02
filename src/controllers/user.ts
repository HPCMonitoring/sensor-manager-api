import { userService } from "@services";
import { FastifyRequest } from "fastify";

async function getUserById(
    request: FastifyRequest<{
        Params: { userId: string };
    }>
) {
    return userService.getById(request.params.userId);
}

export const usersCrtler = {
    getUserById
};
