import { Request, Response } from "express";
import { CreateNotificationDTO, GetAllNotificationsDTO } from "../dtos/notification.dto";
import { prisma } from "../config/db";

export const getAllNotifications = async (req: Request, res: Response): Promise<GetAllNotificationsDTO> => {
    let result = await prisma.notifications.findMany();
    return {
        status: true,
        message: "Users notifications fetched successfully.",
        notificationsList: result,
    }
};


export const getNotificationsByUserId = async (userId: number) => {
    const notifications = await prisma.user_notifications.findMany({
        where: { user_id: userId },
        include: {
            notifications: true,
        },
        orderBy: {
            created_at: "desc",
        }
    });

    return notifications.map(n => ({
        notificationId: n.notification_id,
        message: n.notifications?.message,
        type: n.notifications?.type,
        created_at: n.notifications?.created_at,
        is_read: n.is_read,
    }));
};



export const createNotification = async (req: Request, res: Response) => {
    let { userId, message }: CreateNotificationDTO = req.body;
    const notification = await prisma.notifications.create({
        data: {
            type: "push", // or 'email', 'sms' – for now let's default it to 'push'
            message,
            user_notifications: {
                create: {
                    user_id: userId,
                    status: "sent", // or 'pending' if needed
                },
            },
        },
    });

    res.json({
        message: `Notification sent to user ${userId}: ${message}`,
        notification,
    })
};
