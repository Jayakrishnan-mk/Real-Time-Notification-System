import { Queue } from "bullmq";
import { redisConnection } from "@/utils/redisConnection";
import { NotificationJobData } from "@/types/notificationJob.type";

// Queue definition, retry logic, backoff, Redis config

export const notificationQueue = new Queue<NotificationJobData>(
    'notificationQueue',
    {
        connection: redisConnection as any,
        // This ensures reliability — if some external service fails briefly, 
        // retries will help without you needing to restart anything.
        defaultJobOptions: {
            attempts: 3, // Retry 3 times if job fails
            backoff: {
                type: "exponential", // exponential delay between retries
                delay: 3000,         // starts with 3 seconds
            },
            removeOnComplete: false, // 👈 keeps completed jobs
            removeOnFail: false,
        },
    }
);
