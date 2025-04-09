import express from "express";
import { validate } from "../middleware/validate";
import { getNotifications, getUserNotifications, markNotificationReadController, sendNotification, unreadCountController } from "../controllers/notificationController";
import { CreateNotificationDTO, GetUserNotificationsDTO } from "../dtos/input/notification.input";
import { authMiddleware } from "@/middleware/authMiddleware";

const router = express.Router();

// Public route 
router.get("/", getNotifications);

router.use(authMiddleware);
// Protected routes...... 
router.get("/user", validate(GetUserNotificationsDTO, "query"), getUserNotifications);
router.post("/", validate(CreateNotificationDTO), sendNotification);
router.patch("/mark-read", markNotificationReadController);
router.get("/unread-count", unreadCountController);

export default router;
