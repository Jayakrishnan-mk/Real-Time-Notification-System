// src/utils/redisConnection.ts
// centralized Redis connection file for both Queue and Worker to use.
// Central Redis client shared across app

import Redis from 'ioredis';
import { REDIS_URL } from '@/config/env';

let redis: Redis;

if (!REDIS_URL) {
    console.error('❌ REDIS_URL is not defined in environment variables');
    process.exit(1); // Exit immediately if REDIS_URL is missing
}

console.log(`🔗 Connecting to Redis using REDIS_URL: ${REDIS_URL}`);
redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    retryStrategy: (times) => Math.min(times * 50, 2000), // Retry with exponential backoff
    enableOfflineQueue: true, // Queue commands while offline
    connectTimeout: 10000, // 10 seconds timeout
});

// Add error handler
redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});

// Add connection handler
redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

// Verify connection with PING
redis.ping()
    .then((result) => {
        console.log(`✅ Redis PING response: ${result}`);
    })
    .catch((err) => {
        console.error('❌ Redis connection failed during startup:', err);
        process.exit(1);
    });

export const redisConnection = redis;