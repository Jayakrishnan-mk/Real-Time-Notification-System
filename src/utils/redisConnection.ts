// centralized Redis connection file for both Queue and Worker to use.
// Central Redis client shared across app

import { RedisOptions } from 'ioredis';
import { REDIS_URL } from '@/config/env';

export const redisOptions: RedisOptions = REDIS_URL
    ? {
        // Production
        maxRetriesPerRequest: null,
        lazyConnect: false,
        // BullMQ will internally use this URL if provided
        // No need to parse manually
    }
    : {
        // Development
        host: '127.0.0.1',
        port: 6379,
        maxRetriesPerRequest: null,
    };
