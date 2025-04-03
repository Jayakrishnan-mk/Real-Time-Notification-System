import { z } from "zod";

export const SignupDTO = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginDTO = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const CreateNotificationDTO = z.object({
    userId: z.number(),
    message: z.string().min(1, "Message cannot be empty"),
});

