import { Server as SocketIOServer, Socket } from "socket.io";
import { Server } from "http";
import { socketAuthMiddleware } from "@/middleware/socketAuth";

let io: SocketIOServer;
const userSocketMap = new Map<number, Set<string>>(); // userId -> Set of socket.id

export const initializeSocket = (server: Server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "*",
        },
    });

    // Before connection listener
    io.use(socketAuthMiddleware);

    io.on("connection", (socket: Socket) => {
        console.log("🔌 New socket connected:", socket.id);

        const userId = socket.data.userId;

        if (!userId || isNaN(Number(userId))) {
            console.log("❌ Invalid userId. Disconnecting...");
            socket.disconnect(true);
            return;
        }

        const uid = Number(userId);

        // Map userId to socket.id
        if (!userSocketMap.has(uid)) {
            userSocketMap.set(uid, new Set());
        }
        userSocketMap.get(uid)?.add(socket.id);

        // Join room for easier broadcasting
        socket.join(`user-${uid}`);

        console.log(`🧑‍💻 Socket ${socket.id} registered for user ${uid}`);

        socket.on("disconnect", () => {
            console.log(`❌ Socket ${socket.id} disconnected for user ${uid}`);
            userSocketMap.get(uid)?.delete(socket.id);

            if (userSocketMap.get(uid)?.size === 0) {
                userSocketMap.delete(uid);
                console.log(`🧹 Cleaned up all sockets for user ${uid}`);
            }
        });

        // Optional: receipts or reconnect logic here
    });
};

// Exported function to send notification
export const sendNotificationToUser = (userId: number, payload: any) => {
    const sockets = userSocketMap.get(userId);

    if (!sockets || sockets.size === 0) {
        console.log(`⚠️ No active sockets for user ${userId}`);
        return;
    }

    io.to(`user-${userId}`).emit("notification", payload);
    console.log(`📤 Sent notification to user ${userId}`, payload);
};
