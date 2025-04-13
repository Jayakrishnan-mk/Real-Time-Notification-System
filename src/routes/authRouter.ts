import express from "express";
import { signup, login } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { LoginDTO, SignupDTO } from "../dtos/input/auth.input";
import { authRateLimiter } from "@/middleware/rateLimiter";

const router = express.Router();

router.post("/signup", authRateLimiter, validate(SignupDTO), signup);
router.post("/login", authRateLimiter, validate(LoginDTO), login);

export default router;
