import { Server as SocketIOServer } from "socket.io";

export const sendNotificationToUser = (
    io: SocketIOServer,
    userId: number,
    payload: any
) => {
    console.log(`📤 Emitting notification to user ${userId} -> Room: user-${userId}`);
    io.to(`user-${userId}`).emit("notification", payload);
};
