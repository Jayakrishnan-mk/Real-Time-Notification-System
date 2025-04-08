import express from "express";
import { getAllUsers } from '../controllers/userController';
import { authMiddleware } from "@/middleware/authMiddleware";

const router: express.Router = express.Router();

router.get("/", authMiddleware, getAllUsers);

export default router;
