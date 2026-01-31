import express from "express"
import { createUser, loginUser } from "../controllers/userController.js"
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/create",  createUser);
router.post("/login", loginLimiter, loginUser);

export default router;