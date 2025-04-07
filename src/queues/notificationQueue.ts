// queues/notificationQueue.ts

import { Queue } from "bullmq";
import redisClient from "../utils/redisClient";
import { NotificationJobData } from "@/types/notificationJob.type";

// export const notificationQueue = new Queue("notification-queue", {
export const notificationQueue = new Queue<NotificationJobData>(
    'notificationQueue', {
    connection: redisClient,
});
