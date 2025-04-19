// centralized Redis connection file for both Queue and Worker to use.
// Central Redis client shared across app

import IORedis from 'ioredis';
import { REDIS_URL } from '@/config/env';

// If REDIS_URL exists, use it, else fallback to local Redis
export const redisConnection = REDIS_URL
    ? new IORedis(REDIS_URL, { maxRetriesPerRequest: null })
    : new IORedis({         // Local Redis connection
        host: '127.0.0.1',
        port: 6379,
        maxRetriesPerRequest: null,
    });
