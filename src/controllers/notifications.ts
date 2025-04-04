import { Request, Response } from "express";
import { getAllNotifications, createNotification, getNotificationsByUserId } from "../services/notificationService";

export const getNotifications = async (req: Request, res: Response) => {
    let data = await getAllNotifications(req, res);
    res.json(data);
};

export const getNotificationsForUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
        const notifications = await getNotificationsByUserId(userId);
        res.json(notifications);
    } catch (err: any) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

export const sendNotification = async (req: Request, res: Response) => {
    try {
        const { userId, message } = req.body;
        const response = await createNotification(userId, message);
        res.status(201).json(response);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
