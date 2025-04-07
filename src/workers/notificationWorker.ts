import { Worker } from 'bullmq';
import redisConnection from '@/utils/redisClient';
import { createNotification } from '@/services/notificationService';
import { NotificationJobData } from '@/types/notificationJob.type';

console.log("✅ Connected to Redis");

// 👷 Worker to process notification jobs
const notificationWorker = new Worker<NotificationJobData>(
    'notificationQueue',
    async (job) => {
        console.log(`🔧 Processing job: ${job.id} ${job.name}`);
        console.log("📨 Data:", job.data);

        const { userId, message } = job.data;

        try {
            const result = await createNotification(userId, message);
            // console.log("✅ Notification sent:", result.id);
            if ('notification' in result && result.notification) {
                console.log("✅ Notification sent:", result.notification.id);
            } else {
                console.error("❌ Notification creation failed:", result.message);
            }

        } catch (err) {
            console.error("❌ Error processing job:", err);
        }
    },
    {
        connection: redisConnection,
    }
);
console.log("👷 Worker initialized and waiting for jobs...");
