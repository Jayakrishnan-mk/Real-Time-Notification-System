import express from "express";
import { getAllUsers } from '../controllers/userController';

const router: express.Router = express.Router();

router.get("/", getAllUsers);

export default router;
