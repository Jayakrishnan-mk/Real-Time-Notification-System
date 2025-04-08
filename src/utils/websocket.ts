import WebSocket from 'ws';
import { createClient } from 'redis';
import { prisma } from '@/config/db';

let wss: WebSocket.Server | null = null;
const activeConnections = new Map<number, Set<WebSocket>>(); // Map userId -> Set of sockets
const heartbeatInterval = 30000; // 30 seconds

// Multiple socket support per user.........
// Heartbeat-based stale socket removal.....
// Reliable Redis-based messaging...........

export const getActiveConnections = () => activeConnections;

export const initWebSocket = async (server: any) => {
    wss = new WebSocket.Server({ server });

    // Redis subscriber
    const redisSub = createClient();
    await redisSub.connect();

    // Subscribe to Redis channel
    await redisSub.subscribe('notification-channel', (message) => {
        const { userId, message: msg } = JSON.parse(message);
        sendNotificationToUser(userId, msg);
    });

    wss.on('connection', async (ws, req) => {
        console.log('🔌 Client connected via WebSocket');

        const params = new URLSearchParams(req.url?.split('?')[1]);
        const userId = Number(params.get('userId'));

        // ✅ Validate userId
        if (!userId || isNaN(userId)) {
            console.warn("❌ Invalid userId provided, closing socket");
            ws.close(1008, "Invalid userId");
            return;
        }

        // ✅ Check if user exists in DB
        const userExists = await prisma.users.findUnique({ where: { id: userId } });

        if (!userExists) {
            console.warn(`❌ No user found in DB for userId ${userId}, closing socket`);
            ws.close(1008, "User does not exist");
            return;
        }

        // Register socket for the user
        if (!activeConnections.has(userId)) {
            activeConnections.set(userId, new Set());
        }
        activeConnections.get(userId)?.add(ws);
        console.log(`🧑‍💻 Registered socket for user ${userId}`);

        // Set initial isAlive
        (ws as any).isAlive = true;

        ws.on('pong', () => {
            (ws as any).isAlive = true;
        });

        ws.on('close', () => {
            const userSockets = activeConnections.get(userId);
            if (userSockets) {
                userSockets.delete(ws);
                console.log(`❌ Disconnected socket for user ${userId}`);

                if (userSockets.size === 0) {
                    activeConnections.delete(userId);
                    console.log(`🧹 No more active sockets for user ${userId}, cleaned up.`);
                }
            }
        });

        ws.on('error', (err) => {
            console.error("⚠️ WebSocket error:", err);
        });
    });

    // Heartbeat interval
    setInterval(() => {
        wss?.clients.forEach((ws) => {
            if (!(ws as any).isAlive) {
                console.log("💔 Terminating dead socket");
                ws.terminate();

                // Cleanup terminated socket from map
                for (const [userId, socketSet] of activeConnections.entries()) {
                    if (socketSet.has(ws)) {
                        socketSet.delete(ws);
                        console.log(`🧹 Cleaned up dead socket for user ${userId}`);
                        if (socketSet.size === 0) {
                            activeConnections.delete(userId);
                        }
                        break;
                    }
                }
                return;
            }

            (ws as any).isAlive = false;
            ws.ping();
        });
    }, heartbeatInterval);
};

export const sendNotificationToUser = (userId: number, message: string) => {
    const userSockets = activeConnections.get(userId);

    if (!userSockets || userSockets.size === 0) {
        console.log(`⚠️ No active WebSocket for user ${userId}`);
        return;
    }

    for (const socket of userSockets) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'notification', message }));
        }
    }

    console.log(`📤 Sent real-time notification to all sockets of user ${userId}`);
};
