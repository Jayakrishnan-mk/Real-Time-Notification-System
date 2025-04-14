import express from "express";
import { validate } from "../middleware/validate";
import {
    deleteNotificationController,
    getNotifications,
    getUserNotifications,
    markNotificationReadController,
    sendNotification,
    unreadCountController,
} from "../controllers/notificationController";
import {
    CreateNotificationDTO,
    DeleteNotificationDTO,
    GetUserNotificationsDTO,
} from "../dtos/input/notification.input";
import { authMiddleware } from "@/middleware/authMiddleware";
import { generalRateLimiter } from "@/middleware/rateLimiter";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification-related APIs
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications (Public)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get("/", generalRateLimiter, getNotifications);

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Send a notification to a user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 4
 *               title:
 *                 type: string
 *                 example: "System Alert"
 *               message:
 *                 type: string
 *                 example: "Server will restart at midnight"
 *               type:
 *                 type: string
 *                 enum: [push, email, sms]
 *                 example: "push"
 *     responses:
 *       200:
 *         description: Notification job queued successfully
 */
router.post("/", generalRateLimiter, validate(CreateNotificationDTO), sendNotification);

/**
 * @swagger
 * /api/notifications/user:
 *   get:
 *     summary: Get notifications for a specific user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user whose notifications are to be fetched
 *     responses:
 *       200:
 *         description: User-specific notifications
 */
router.get("/user", generalRateLimiter, validate(GetUserNotificationsDTO, "query"), getUserNotifications);

/**
 * @swagger
 * /api/notifications/mark-read:
 *   patch:
 *     summary: Mark a specific notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 4
 *               notification_id:
 *                 type: integer
 *                 example: 6
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.patch("/mark-read", generalRateLimiter, markNotificationReadController);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get unread notification count for logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count of unread notifications
 */
router.get("/unread-count", generalRateLimiter, unreadCountController);

/**
 * @swagger
 * /api/notifications:
 *   delete:
 *     summary: Delete a notification for the logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: 12
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 */
router.delete("/", generalRateLimiter, validate(DeleteNotificationDTO), deleteNotificationController);

export default router;
