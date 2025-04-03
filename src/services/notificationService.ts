import { Request, Response } from "express";
import { CreateNotificationDTO } from "../dtos/notification.dto";

export const getAllNotifications = (req: Request, res: Response) => {
    res.json({ message: "Fetching all notifications..." });
};


export const createNotification = (req: Request, res: Response) => {
    const { userId, message }: CreateNotificationDTO = req.body;

    res.json({
        "message": `Notification sent to user ${userId}: ${message}`
    });
};
