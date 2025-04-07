import { Request, Response } from "express";
import { getAllNotifications, markNotificationAsRead, getUserNotificationDetails } from "../services/notificationService";
import { GetUserNotificationsDTO, MarkNotificationAsReadDTO } from "../dtos/input/notification.input";
import { addNotificationJob } from "@/services/notificationQueue.service";
import { prisma } from "@/config/db";

export const markNotificationReadController = async (req: Request, res: Response) => {
    const dto: MarkNotificationAsReadDTO = req.body;

    const result = await markNotificationAsRead(dto);

    res.status(200).json(result);
};

export const getNotifications = async (req: Request, res: Response) => {
    let data = await getAllNotifications(req, res);
    res.json(data);
};

export const getUserNotifications = async (req: Request, res: Response) => {
    try {
        const { userId } = GetUserNotificationsDTO.parse(req.query);

        const data = await getUserNotificationDetails(Number(userId));
        res.json(data);
    } catch (err) {
        console.error("Controller error:", err);
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};


export const sendNotification = async (req: Request, res: Response) => {
    try {
        const { userId, message } = req.body;

        // ✅ Check if user exists
        const userExists = await prisma.users.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            return res.status(404).json({ success: false, message: `User with id ${userId} not found` });
        }

        // notification queue........BullMQ...........
        await addNotificationJob({ userId, message });

        res.status(200).json({
            status: true,
            message: "✅ Notification job queued successfully",
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
