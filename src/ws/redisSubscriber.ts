import { createClient } from "redis";
import { Server as SocketIOServer } from "socket.io";
import { userSocketMap } from "@/ws/userSocketStore";
import { sendNotificationToUser } from "@/ws/sendNotificationToUser";
import { log } from "@/utils/logger";

// [Job -> Queue -> Worker -> Redis Publish] ===> [Redis Subscriber -> WebSocket Emit]


const redisSub = createClient();

export const initializeRedisSubscriber = async (io: SocketIOServer) => {
    await redisSub.connect();
    log("📡 Redis subscriber connected");

    await redisSub.subscribe("notification-channel", (message) => {
        try {
            console.log(`📥 Received Redis message: ${message}`);
            const parsed = JSON.parse(message);
            const { userId, ...payload } = parsed;

            console.log("[DEBUG] Active sockets for user", userId, "=>", [
                ...(userSocketMap.get(userId) || []),
            ]);

            sendNotificationToUser(io, Number(userId), payload);

            log(`📨 Redis subscriber sent notification to user ${userId}`);
        } catch (err) {
            console.error("❌ Error processing Redis message:", err);
        }
    });
};
