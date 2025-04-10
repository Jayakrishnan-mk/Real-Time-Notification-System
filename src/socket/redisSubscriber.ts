import { createClient } from "redis";
import { sendNotificationToUser } from "@/socket/socket";
import { log } from "@/utils/logger";

// [Job -> Queue -> Worker -> Redis Publish] ===> [Redis Subscriber -> WebSocket Emit]


const redisSub = createClient();

export const initializeRedisSubscriber = async () => {
    await redisSub.connect();
    log("📡 Redis subscriber connected");

    await redisSub.subscribe("notification-channel", (message) => {
        const parsed = JSON.parse(message);
        const { userId, message: notificationMessage } = parsed;

        sendNotificationToUser(Number(userId), {
            message: notificationMessage,
        });

        log(`📨 Redis subscriber sent notification to user ${userId}`);
    });
};
