import { Request, Response } from "express";
import { signupUser, loginUser } from "../services/authService";

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const newUser = await signupUser(name, email, password);
        res.status(201).json({ message: "User created successfully", userId: newUser.id });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const { token } = await loginUser(email, password);
        res.json({ message: "Login successful", token });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
