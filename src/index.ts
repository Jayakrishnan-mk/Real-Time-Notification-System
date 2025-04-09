import 'module-alias/register';
import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import userRoutes from './routes/userRouter';
import notificationRoutes from './routes/notificationRouter';
import authRoutes from "./routes/authRouter";
import { initializeSocket } from './socket/socket';
import { initializeRedisSubscriber } from './socket/redisSubscriber';
import { errorHandler } from './middleware/errorHandler';
import morgan from 'morgan';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { notificationQueue } from './queues/notificationQueue';
import { createBullBoard } from '@bull-board/api';

dotenv.config();

const app = express();
const server = http.createServer(app);


const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [new BullMQAdapter(notificationQueue)],
    serverAdapter,
});

// bull queue dashboard
app.use('/admin/queues', serverAdapter.getRouter());

// Initialize socket.io
initializeSocket(server);
try {
    (async () => {
        await initializeRedisSubscriber();
    })();
} catch (error) {
    console.log(error);
}

const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON data
app.use(express.json());

app.use(morgan('dev'));

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
});
