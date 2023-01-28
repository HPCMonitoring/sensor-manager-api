import { prisma } from "@repositories";
import { BadRequest } from "@exceptions";
import { USER_NOT_FOUND } from "@constants";

async function getById(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (user === null) throw new BadRequest(USER_NOT_FOUND);
    return user;
}

export const userService = {
    getById
};
