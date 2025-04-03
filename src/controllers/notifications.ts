import { Request, Response } from "express";
import { getAllNotifications, createNotification } from "../services/notificationService";
import { CreateNotificationDTO } from "../dtos/notification.dto";

export const getNotifications = (req: Request, res: Response) => {
    res.json(getAllNotifications(req, res));
};

export const sendNotification = (req: Request, res: Response) => {
    try {
        const { userId, message } = req.body;
        const response = createNotification(userId, message);
        res.json(response);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
