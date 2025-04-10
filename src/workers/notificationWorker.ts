import 'module-alias/register';

import { Worker } from "bullmq";
import redisConnection from "@/utils/redisClient";
import { createNotification } from "@/services/notificationService";
import { NotificationJobData } from "@/types/notificationJob.type";
import { log, logError } from "@/utils/logger";
import { createClient } from 'redis';

// Processes jobs + publishes to Redis for WebSocket

const redisPub = createClient();

const run = async () => {
    await redisPub.connect();
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

                    // 👇 Publish to Redis so WebSocket server picks it up
                    await redisPub.publish('notification-channel', JSON.stringify({
                        userId,
                        message,
                    }));

                    log(`📢 Published message to Redis for user ${userId}`);
                } else {
                    logError("❌ Notification creation failed:", result.message);
                }

            } catch (err) {
                logError("🔥 Error processing job:", err);
            }
        },
        {
            connection: redisConnection,
        }
    );

    log("👷 Worker initialized and waiting for jobs...");
};

run().catch((err) => logError("🚨 Failed to start worker", err));
