
// centralized Redis connection file for both Queue and Worker to use.

import { Redis } from "ioredis";

const connection = new Redis({
    host: "127.0.0.1",  // or Redis cloud host
    port: 6379,
    maxRetriesPerRequest: null, // ✅ required by BullMQ
});

connection.on("connect", () => {
    console.log("✅ Connected to Redis");
});

connection.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});

export default connection;
