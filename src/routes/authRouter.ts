import express from "express";
import { signup, login, logout } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { LoginDTO, SignupDTO } from "../dtos/input/auth.input";
import { authRateLimiter } from "@/middleware/rateLimiter";
import { refreshToken } from "../controllers/authController";

const router = express.Router();

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Rotate and refresh tokens using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: 9283abc...longstring
 *     responses:
 *       200:
 *         description: New access and refresh tokens issued. Previous token revoked.
 *       403:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh-token", refreshToken);


/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       201:
 *         description: User signed up successfully
 *       400:
 *         description: Invalid input
 */
router.post("/signup", authRateLimiter, validate(SignupDTO), signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authRateLimiter, validate(LoginDTO), login);


/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user by revoking refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: abc123...longstring
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Refresh token missing
 */
router.post("/logout", logout);

export default router;
