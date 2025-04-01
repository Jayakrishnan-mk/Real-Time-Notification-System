import express, { Request, Response } from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Use .env PORT if exists, fallback to 3000

// Middleware to parse incoming JSON data
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database');
});

// Basic Express endpoint to test
app.get('/', (req: Request, res: Response) => {
    res.send('Real-Time Notification System Running!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
