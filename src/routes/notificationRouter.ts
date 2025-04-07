import express from "express";
import { validate } from "../middleware/validate";
import { getNotifications, getUserNotifications, markNotificationReadController, sendNotification } from "../controllers/notificationController";
import { CreateNotificationDTO, GetUserNotificationsDTO } from "../dtos/input/notification.input";

const router = express.Router();

router.get("/", getNotifications);
router.get("/user", validate(GetUserNotificationsDTO, "query"), getUserNotifications);
router.post("/", validate(CreateNotificationDTO), sendNotification);
router.patch("/mark-read", markNotificationReadController);

export default router;
