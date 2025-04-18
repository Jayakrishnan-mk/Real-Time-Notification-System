import dotenv from 'dotenv';
dotenv.config();

export const {
    PORT,
    NODE_ENV,
    DATABASE_URL,
    JWT_SECRET,
    SWAGGER_SERVER,
    QUEUE_ADMIN_USERNAME,
    QUEUE_ADMIN_PASSWORD,
    REDIS_URL,
} = process.env;
