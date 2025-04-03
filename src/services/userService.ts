import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const fetchAllUsers = async () => {
    return await prisma.users.findMany();
};

