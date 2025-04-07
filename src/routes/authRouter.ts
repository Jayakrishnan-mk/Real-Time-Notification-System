import express from "express";
import { signup, login } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { LoginDTO, SignupDTO } from "../dtos/input/auth.input";

const router = express.Router();

router.post("/signup", validate(SignupDTO), signup);
router.post("/login", validate(LoginDTO), login);

export default router;
