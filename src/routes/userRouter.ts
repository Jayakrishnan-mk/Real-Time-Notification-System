import express from "express";
import { getAllUsers } from '../controllers/userController';
import { authMiddleware } from "@/middleware/authMiddleware";
import { generalRateLimiter } from "@/middleware/rateLimiter";

const router: express.Router = express.Router();

router.get("/", generalRateLimiter, authMiddleware, getAllUsers);

export default router;
