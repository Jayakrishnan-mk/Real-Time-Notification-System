import { Request, Response } from "express";
import { signupUser, loginUser, logoutUser } from "../services/authService";
import { refreshUserToken } from "../services/authService";


export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token required",
                status: false
            });
        }

        const result = await logoutUser(refreshToken);
        res.status(200).json(result);

    } catch (error: any) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token is required" });
        }

        const { accessToken, newRefreshToken } = await refreshUserToken(refreshToken, req);

        res.json({
            status: true,
            message: "Token refreshed successfully",
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (error: any) {
        res.status(403).json({ error: error.message });
    }
};


export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const newUser = await signupUser(name, email, password);
        res.status(201).json({
            status: true,
            message: "User created successfully",
            userId: newUser.id
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const { accessToken, refreshToken } = await loginUser(email, password, req);

        res.json({
            message: "Login successful",
            status: true,
            accessToken,
            refreshToken
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
