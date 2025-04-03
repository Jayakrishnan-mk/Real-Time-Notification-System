import express from "express";
import { signup, login } from "../controllers/auth";
import { validate } from "../middleware/validate";
import { SignupDTO, LoginDTO } from "../dtos/user.dto";

const router = express.Router();

router.post("/signup", validate(SignupDTO), signup);
router.post("/login", validate(LoginDTO), login);

export default router;
