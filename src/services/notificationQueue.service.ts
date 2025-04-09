import { notificationQueue } from "@/queues/notificationQueue";
import { NotificationJobData } from "@/types/notificationJob.type";

// Function to enqueue notification jobs

export async function addNotificationJob(data: NotificationJobData) {
    try {
        await notificationQueue.add("sendNotification", data);
        console.log("📥 Notification job added to queue");
    } catch (error) {
        console.error("❌ Failed to add notification job:", error);
        throw error;
    }
}