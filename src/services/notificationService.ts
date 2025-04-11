import { Request, Response } from "express";
import { MarkNotificationAsReadDTO } from "../dtos/input/notification.input";
import { prisma } from "@/config/db";
import { BaseStatus } from "../dtos/output/baseStatus.dto";
import { GetAllNotificationsDTO, GetUserNotificationsOutputDTO } from "../dtos/output/notfication.output";


export const softDeleteNotification = async (id: number, userId: number) => {
    try {
        const userNotification = await prisma.user_notifications.findUnique({
            where: { id },
        });

        if (!userNotification) {
            return {
                status: false,
                message: "Notification not found.",
            };
        }

        if (userNotification.user_id !== userId) {
            return {
                status: false,
                message: "This notification does not belong to the user.",
            };
        }

        if (userNotification.is_deleted) {
            return {
                status: false,
                message: "Notification already deleted.",
            };
        }

        const deleted = await prisma.user_notifications.update({
            where: { id },
            data: { is_deleted: true },
        });

        return {
            status: true,
            message: "Notification soft deleted successfully.",
            data: deleted,
        };
    } catch (error) {
        console.error("Error in softDeleteNotification:", error);
        throw new Error("Failed to delete notification");
    }
};


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

export const getUnreadNotificationCount = async (userId: string) => {
    try {
        const count = await prisma.user_notifications.count({
            where: {
                user_id: Number(userId),
                is_read: false,
                is_deleted: false,
            },
        });

        return count;
    } catch (error) {
        console.error("Error in getUnreadNotificationCount:", error);
        throw error;
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
            where: {
                user_id: userId,
                is_deleted: false
            },
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



export const createNotification = async (
    userId: number,
    title: string,
    message: string,
    type: "push" | "email" | "sms"
) => {
    try {
        const notification = await prisma.notifications.create({
            data: {
                title,
                type, // push | email | sms
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
            message: `Notification sent to user ${userId}: ${title} - ${message}`,
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
