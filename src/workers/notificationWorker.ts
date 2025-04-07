import { Worker } from "bullmq";
import redisConnection from "@/utils/redisClient";
import { createNotification } from "@/services/notificationService";
import { NotificationJobData } from "@/types/notificationJob.type";
import { log, logError } from "@/utils/logger";

log("✅ Connected to Redis");

// 👷 Worker to process notification jobs
const notificationWorker = new Worker<NotificationJobData>(
    "notificationQueue",
    async (job) => {
        log(`🔧 Processing job: ${job.id} ${job.name}`);
        log("📨 Data:", job.data);

        const { userId, message } = job.data;

        try {
            const result = await createNotification(userId, message);
            if ("notification" in result && result.notification) {
                log("✅ Notification sent:", result.notification.id);
            } else {
                logError("Notification creation failed:", result.message);
            }
        } catch (err) {
            logError("Error processing job:", err);
        }
    },
    {
        connection: redisConnection,
    }
);

log("👷 Worker initialized and waiting for jobs...");
