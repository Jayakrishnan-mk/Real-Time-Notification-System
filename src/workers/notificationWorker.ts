import 'module-alias/register';

import dotenv from 'dotenv';
dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});

import { Worker } from "bullmq";
import { redisConnection } from '@/utils/redisConnection';
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

            const { userId, title, message, type } = job.data;

            try {
                const result = await createNotification(userId, title, message, type);

                if ("notification" in result && result.notification) {
                    log("✅ Notification sent:", result.notification.id);

                    // 👇 Publish to Redis so WebSocket server picks it up
                    await redisPub.publish('notification-channel', JSON.stringify({
                        userId,
                        title,
                        message,
                        type,
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
            connection: redisConnection as any,
        }
    );

    // 🧯 Catch async errors on the worker
    notificationWorker.on('error', (err) => {
        logError("❌ Worker error:", err);
    });

    log("👷 Worker initialized and waiting for jobs...");
};

run().catch((err) => logError("🚨 Failed to start worker", err));
