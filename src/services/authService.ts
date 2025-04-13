import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_MS } from "@/config/token";
import { Request } from "express";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}


export const signupUser = async (name: string, email: string, password: string) => {
    try {
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
    } catch (error) {
        console.log("Sign up error:", error);
        throw error;
    }
};


export const loginUser = async (email: string, password: string, req: Request) => {
    try {
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        // Generate access token
        const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

        // Generate refresh token
        const rawRefreshToken = crypto.randomBytes(64).toString("hex");
        const hashedRefreshToken = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS); // 7 days

        // Before creating new token, limit to 3 active sessions
        const activeTokens = await prisma.refresh_token.findMany({
            where: {
                userId: user.id,
                revoked: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'asc' }, // Oldest first
        });

        if (activeTokens.length >= 3) {
            // Revoke the oldest token to make space
            await prisma.refresh_token.update({
                where: { id: activeTokens[0].id },
                data: {
                    revoked: true,
                    lastUsedAt: new Date()
                },
            });
        }

        // create a refresh token linked to the user
        await prisma.refresh_token.create({
            data: {
                token: hashedRefreshToken,
                userId: user.id,
                expiresAt,
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
                lastUsedAt: new Date(), // Setting the lastUsedAt to the current time
            },
        });

        return { accessToken, refreshToken: rawRefreshToken };
    } catch (error) {
        console.log("Login error:", error);
        throw error;
    }
};


export const refreshUserToken = async (refreshToken: string, req: Request) => {
    try {
        // Cleanup: Delete expired or revoked tokens....
        await prisma.refresh_token.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lt: new Date() } },
                    { revoked: true }
                ]
            },
        });

        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const existingToken = await prisma.refresh_token.findFirst({
            where: {
                token: hashedToken,
                revoked: false,
                expiresAt: { gt: new Date() }
            },
            include: { user: true }
        });

        if (!existingToken) {
            throw new Error("Invalid or expired refresh token");
        }

        // Revoke the old refresh token
        await prisma.refresh_token.update({
            where: { id: existingToken.id },
            data: {
                revoked: true,
                lastUsedAt: new Date()
            }
        });

        // Generate new access & refresh tokens
        const accessToken = jwt.sign({ id: existingToken.user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

        const newRawRefreshToken = crypto.randomBytes(64).toString("hex");
        const newHashedRefreshToken = crypto.createHash("sha256").update(newRawRefreshToken).digest("hex");
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS); // 7 days

        await prisma.refresh_token.create({
            data: {
                token: newHashedRefreshToken,
                userId: existingToken.user.id,
                expiresAt,
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
                lastUsedAt: new Date(), // Setting the lastUsedAt to the current time
            }
        });

        return {
            accessToken,
            newRefreshToken: newRawRefreshToken
        };
    } catch (error) {
        console.log("refresh token error:", error);
        throw error;
    }
};


export const logoutUser = async (refreshToken: string) => {
    try {
        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

        // Revoke the token
        await prisma.refresh_token.updateMany({
            where: { token: hashedToken },
            data: {
                revoked: true,
                lastUsedAt: new Date()
            },
        });

        return {
            status: true,
            message: "Logged out successfully"
        };
    } catch (error) {
        console.log("Logout error:", error);
        throw error;
    }
};

