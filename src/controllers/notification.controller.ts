import { Request, Response } from "express";
import { getAllNotifications, markNotificationAsRead, getUserNotificationDetails, getUnreadNotificationCount, softDeleteNotification } from "../services/notificationService";
import { GetUserNotificationsDTO, MarkNotificationAsReadDTO } from "../dtos/input/notification.dto";
import { addNotificationJob } from "@/services/notificationQueue.service";
import { prisma } from "@/config/db";
import { JwtPayload } from "jsonwebtoken";



export const deleteNotificationController = async (
    req: Request & { user?: JwtPayload | { id: number } },
    res: Response) => {
    try {
        const { id } = req.body;
        const userId = typeof req.user === "object" && "id" in req.user ? req.user.id : null;

        if (!userId) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }

        const result = await softDeleteNotification(id, userId);

        const statusCode = result.status ? 200 : 400;
        return res.status(statusCode).json(result);
    } catch (error) {
        console.error("Error in deleteNotificationController:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
};

export const markNotificationReadController = async (req: Request, res: Response) => {
    const dto: MarkNotificationAsReadDTO = req.body;

    const result = await markNotificationAsRead(dto);

    res.status(200).json(result);
};


export const unreadCountController = async (req: Request & { user?: JwtPayload | string }, res: Response) => {
    try {
        const userId = typeof req.user === "object" && "id" in req.user ? req.user.id : null;

        if (!userId) {
            return res.status(401).json({ status: false, message: "Unauthorized" });
        }

        const unreadCount = await getUnreadNotificationCount(userId);

        return res.status(200).json({
            status: true,
            message: "unread count fetched successfully.",
            data: { unreadCount },
        });
    } catch (error) {
        console.error("Error in unreadCountController:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
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
        const { userId, title, message, type } = req.body;

        // ✅ Check if user exists
        const userExists = await prisma.users.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            return res.status(404).json({ success: false, message: `User with id ${userId} not found` });
        }

        // notification queue........BullMQ...........
        await addNotificationJob({ userId, title, message, type });

        res.status(200).json({
            status: true,
            message: "✅ Notification job queued successfully",
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
