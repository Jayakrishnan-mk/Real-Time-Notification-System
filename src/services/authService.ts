import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

export const signupUser = async (name: string, email: string, password: string) => {
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("Email already in use");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    return await prisma.users.create({
        data: { name, email, password: hashedPassword }
    });
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    return { token };
};
