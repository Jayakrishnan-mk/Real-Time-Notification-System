import dotenv from 'dotenv';

console.log("NODE_ENV is", process.env.NODE_ENV);
dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});
