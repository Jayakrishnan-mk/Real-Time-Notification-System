import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRouter';
import notificationRoutes from './routes/notificationRouter';
import authRoutes from "./routes/authRouter";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Use .env PORT if exists, fallback to 3000

// Middleware to parse incoming JSON data
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/auth", authRoutes);

// Basic Express endpoint to test
app.get('/', (req: Request, res: Response) => {
    res.send('Real-Time Notification System Running!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
