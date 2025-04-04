import { Request, Response } from "express";
import { getAllNotifications, createNotification, markNotificationAsRead, getUserNotificationDetails } from "../services/notificationService";
import { GetUserNotificationsDTO, GetUserNotificationsDTOType, MarkNotificationAsReadDTO } from "../dtos/input/notification.input";

export const markNotificationReadController = async (req: Request, res: Response) => {
    const dto: MarkNotificationAsReadDTO = req.body;

    const result = await markNotificationAsRead(dto);

    res.status(200).json(result);
};

export const getNotifications = async (req: Request, res: Response) => {
    let data = await getAllNotifications(req, res);
    res.json(data);
};

// controllers/notificationController.ts
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
        const response = await createNotification(userId, message);
        res.status(201).json(response);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
