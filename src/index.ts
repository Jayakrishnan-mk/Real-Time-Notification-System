import './loadEnv'; // 👈 This ensures env is loaded BEFORE anything else

import path from 'path';
import 'module-alias/register';
import express, { Request, Response } from 'express';
import http from 'http';
import userRoutes from './routes/user.route';
import notificationRoutes from './routes/notification.route';
import authRoutes from "./routes/auth.route";
import { initializeSocket } from './ws/socket';
import { initializeRedisSubscriber } from './ws/redisSubscriber';
import { errorHandler } from './middleware/errorHandler';
import morgan from 'morgan';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { notificationQueue } from './queues/notificationQueue';
import { createBullBoard } from '@bull-board/api';
import { swaggerSpec } from './utils/swagger';
import swaggerUi from 'swagger-ui-express';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const server = http.createServer(app);

// Serving static files from src/public
app.use(express.static(path.join(__dirname, "public")));

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [new BullMQAdapter(notificationQueue)],
    serverAdapter,
});

// Protected Bull dashboard with basic auth
app.use(
    "/admin/queues",
    basicAuth({
        users: { admin: process.env.QUEUE_ADMIN_PASSWORD! },
        challenge: true,
    }),
    serverAdapter.getRouter()
);

// Initialize socket.io
const io = initializeSocket(server); // returns the io instance
initializeRedisSubscriber(io); // pass it explicitly

const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON data
app.use(express.json());
app.use(morgan('dev'));

if (process.env.NODE_ENV === 'production') {
    // 🛡️ helmet() adds security HTTP headers to protect against common attacks like XSS, clickjacking, etc.
    app.use(helmet());

    // 🚫 rateLimit() blocks abusive IPs that try to spam your API.
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use(limiter);
}


// swagger......  http://localhost:3000/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/auth", authRoutes);

// Test route - Basic Express endpoint to test
app.get('/', (req: Request, res: Response) => {
    res.send('Real-Time Notification System Running!');
});

// Global error handler 
app.use(errorHandler);

// server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
