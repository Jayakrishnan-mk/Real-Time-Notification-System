import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

const JWT_SECRET = process.env.JWT_SECRET as string; // Make sure using the same secret as REST API

export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
    const token = socket.handshake.auth?.token;

    if (!token) {
        console.log("[SERVER] ❌ No token provided");
        return next(new Error("Authentication error: No token"));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

        // Save the userId on the socket for later use
        socket.data.userId = decoded.id;
        console.log(`[SERVER] 🔐 Authenticated socket for user ${decoded.id}`);

        next();
    } catch (err) {
        console.log("[SERVER] ❌ Invalid token", err);
        return next(new Error("Authentication failed"));
    }
}
