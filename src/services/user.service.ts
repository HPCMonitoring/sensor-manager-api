import { prisma } from "@repositories";
import { BadRequest } from "@exceptions";

async function getById(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    if (user === null) throw new BadRequest("User not found !");
    return user;
}

export const userService = {
    getById
};
