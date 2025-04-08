import { Request, Response } from "express";
import { MarkNotificationAsReadDTO } from "../dtos/input/notification.input";
import { prisma } from "@/config/db";
import { BaseStatus } from "../dtos/output/baseStatus.dto";
import { GetAllNotificationsDTO, GetUserNotificationsOutputDTO } from "../dtos/output/notfication.output";


export const markNotificationAsRead = async (dto: MarkNotificationAsReadDTO): Promise<BaseStatus> => {
    try {
        const { user_id, notification_id } = dto;

        let data = await prisma.user_notifications.updateMany({
            where: {
                user_id,
                notification_id,
            },
            data: {
                is_read: true,
                read_at: new Date(),
            },
        });

        if (!data.count) {
            return {
                status: false,
                message: "Notification not found!",
            };
        }

        return {
            status: true,
            message: "Notification marked as read successfully",
        };
    } catch (err) {
        console.error(err);
        return {
            status: false,
            message: "Something went wrong while marking as read!",
        };
    }
};
 

export const getAllNotifications = async (req: Request, res: Response): Promise<GetAllNotificationsDTO> => {
    try {
        let result = await prisma.notifications.findMany();
        return {
            status: true,
            message: "Users notifications fetched successfully.",
            notificationsList: result,
        }
    } catch (err) {
        console.error(err);
        return {
            status: false,
            message: "Something went wrong while fetching notification list!",
            notificationsList: []
        };
    }
};


export const getUserNotificationDetails = async (userId: number): Promise<GetUserNotificationsOutputDTO> => {
    try {
        const notifications = await prisma.user_notifications.findMany({
            where: { user_id: userId },
            include: {
                notifications: true,
            },
        });

        const formatted = notifications.map((item) => ({
            id: item.notifications?.id!,
            message: item.notifications?.message!,
            type: item.notifications?.type!,
            is_read: item.is_read,
            read_at: item.read_at,
            status: item.status!,
            created_at: item.created_at!,
        }));

        return {
            status: true,
            message: "Fetched notifications for the user.",
            notificationsList: formatted,
        };
    } catch (error) {
        console.error("Error fetching notifications for user:", error);
        return {
            status: false,
            message: "Failed to fetch user notifications.",
            notificationsList: [],
        };
    }
};



export const createNotification = async (userId: number, message: string) => {
    try {
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

        return {
            status: true,
            message: `Notification sent to user ${userId}: ${message}`,
            notification,
        }
    } catch (err) {
        console.error(err);
        return {
            status: false,
            message: "Something went wrong while creating notification!",
        };
    }
};
