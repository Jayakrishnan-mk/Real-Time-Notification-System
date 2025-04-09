import { Queue } from "bullmq";
import redisClient from "../utils/redisClient";
import { NotificationJobData } from "@/types/notificationJob.type";

// Queue definition, retry logic, backoff, Redis config

export const notificationQueue = new Queue<NotificationJobData>(
    'notificationQueue', {
    connection: redisClient,
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
});
