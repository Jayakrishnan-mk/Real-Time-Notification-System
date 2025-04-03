import express from "express";
import { createNotification, getAllNotifications } from "../services/notificationService";
import { validate } from "../middleware/validate";
import { CreateNotificationDTO } from "../dtos/user.dto";

const router = express.Router();

router.get("/", getAllNotifications);
router.post("/", validate(CreateNotificationDTO), createNotification);

export default router;
