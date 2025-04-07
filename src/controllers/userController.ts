import { Request, Response } from "express";
import { fetchAllUsers } from "../services/userService";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await fetchAllUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

