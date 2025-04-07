

import { notificationQueue } from "@/queues/notificationQueue";
import { NotificationJobData } from "@/types/notificationJob.type";

export async function addNotificationJob(data: NotificationJobData) {
    try {
        await notificationQueue.add("sendNotification", data);
        console.log("📥 Notification job added to queue");
    } catch (error) {
        console.error("❌ Failed to add notification job:", error);
        throw error;
    }
}