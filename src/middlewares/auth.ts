import { JWT_SECRET } from "@configs";
import { Forbidden } from "@exceptions";
import { FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export async function verifyToken(request: FastifyRequest) {
    const token = request.cookies.token;
    if (token === undefined) throw new Forbidden("Please login !");
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedPayload: any = jwt.verify(token, JWT_SECRET);
        request.headers["userId"] = decodedPayload["userId"];
    } catch (err) {
        request.log.info(JSON.stringify(err, null, 4));
        throw new Forbidden("Invalid token !");
    }
}
