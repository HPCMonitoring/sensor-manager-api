import { JWT_SECRET } from "@configs";
import { INVALID_TOKEN, MUST_LOGIN_FIRST } from "@constants";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export async function verifyToken(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.token;
    request.log.info(token);

    if (!token) return reply.forbidden(MUST_LOGIN_FIRST);

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedPayload: any = jwt.verify(token, JWT_SECRET);
        request.headers["userId"] = decodedPayload["userId"];
        return reply;
    } catch (err) {
        request.log.info(JSON.stringify(err, null, 4));
        return reply.forbidden(INVALID_TOKEN);
    }
}
