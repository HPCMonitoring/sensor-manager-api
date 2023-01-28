import { prisma } from "@repositories";

async function getById(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId }
    });
}

export const userService = {
    getById
};
