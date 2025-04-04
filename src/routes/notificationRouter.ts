import express from "express";
import { createNotification } from "../services/notificationService";
import { validate } from "../middleware/validate";
import { CreateNotificationDTO } from "../dtos/user.dto";
import { getNotifications, getNotificationsForUser } from "../controllers/notifications";

const router = express.Router();

router.get("/", getNotifications);
router.get("/:userId", getNotificationsForUser);
router.post("/", validate(CreateNotificationDTO), createNotification);

export default router;
