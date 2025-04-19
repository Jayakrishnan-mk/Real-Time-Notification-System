// centralized Redis connection file for both Queue and Worker to use.
// Central Redis client shared across app

import Redis from 'ioredis';
import { REDIS_URL } from '@/config/env';

let redis: Redis;

if (REDIS_URL) {
    console.log(`🔗 Connecting to Redis using REDIS_URL: ${REDIS_URL}`);
    redis = new Redis(REDIS_URL, { maxRetriesPerRequest: null });
} else {
    console.log('🔗 Connecting to Redis using localhost fallback (127.0.0.1:6379)');
    redis = new Redis({
        host: '127.0.0.1',
        port: 6379,
        maxRetriesPerRequest: null,
    });
}

// Add an error handler to monitor connection issues
redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});

redis.ping()
    .then(result => {
        console.log(`✅ Redis connected successfully. PING response: ${result}`);
    })
    .catch(err => {
        console.error('❌ Redis connection failed during startup:', err);
        process.exit(1);
    });

export const redisConnection = redis;
