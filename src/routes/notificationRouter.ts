import express from "express";
import { validate } from "../middleware/validate";
import { getNotifications, getNotificationsForUser, markNotificationReadController, sendNotification } from "../controllers/notifications";
import { CreateNotificationDTO } from "../dtos/input/notification.input";

const router = express.Router();

router.get("/", getNotifications);
// router.get("/:userId", getNotificationsForUser);
// router.get("/user", validate(GetUserNotificationsDTO), getUserNotifications);
router.post("/", validate(CreateNotificationDTO), sendNotification);
router.patch("/mark-read", markNotificationReadController);

export default router;
