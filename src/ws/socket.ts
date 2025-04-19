// src/ws/socket.ts

import { Server as SocketIOServer, Socket } from "socket.io";
import { Server } from "http";
import { socketAuthMiddleware } from "@/middleware/socketAuth";
import { userSocketMap } from "@/ws/userSocketStore";

export const initializeSocket = (server: Server): SocketIOServer => {
    const io = new SocketIOServer(server, {
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
            userSocketMap.get(uid)?.delete(socket.id);
            if (userSocketMap.get(uid)?.size === 0) {
                userSocketMap.delete(uid);
                console.log(`🧹 Cleaned up all sockets for user ${uid}`);
            }
        });
    });

    return io;
};
