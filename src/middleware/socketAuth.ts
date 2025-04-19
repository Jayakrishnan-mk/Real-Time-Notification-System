import { JWT_SECRET } from '@/config/env';
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";


export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
    const token = socket.handshake.auth?.token;

    if (!token) {
        console.log("[SERVER] ❌ No token provided");
        return next(new Error("Authentication error: No token"));
    }

    try {
        // Verify token and check expiration
        const decoded = jwt.verify(token, JWT_SECRET as string) as { id: number, exp: number };

        // Check if the token has expired
        if (decoded.exp * 1000 < Date.now()) {
            console.log("[SERVER] ❌ Token expired");
            return next(new Error("Authentication failed: Token expired"));
        }

        // Save the userId on the socket for later use
        socket.data.userId = decoded.id;
        console.log(`[SERVER] 🔐 Authenticated socket for user ${decoded.id}`);

        next();
    } catch (err) {
        console.log("[SERVER] ❌ Invalid token", err);
        return next(new Error("Authentication failed"));
    }
}
