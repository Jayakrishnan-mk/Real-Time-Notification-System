
// centralized Redis connection file for both Queue and Worker to use.
// Central Redis client shared across app

import { Redis } from "ioredis";

let connection: Redis;

if (process.env.REDIS_URL) {
    // Production (e.g., Railway, AWS)
    connection = new Redis(process.env.REDIS_URL);
} else {
    // Development (local Redis via Docker)
    connection = new Redis({
        host: "127.0.0.1",
        port: 6379,
        maxRetriesPerRequest: null, // ✅ required by BullMQ
    });
}

connection.on("connect", () => {
    console.log("✅ Connected to Redis");
});

connection.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});

export default connection;
