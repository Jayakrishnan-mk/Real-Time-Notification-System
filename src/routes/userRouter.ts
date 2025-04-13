import express from "express";
import { getAllUsers } from '../controllers/userController';
import { authMiddleware } from "@/middleware/authMiddleware";
import { generalRateLimiter } from "@/middleware/rateLimiter";

const router: express.Router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized access
 */
router.get("/", generalRateLimiter, authMiddleware, getAllUsers);

export default router;
