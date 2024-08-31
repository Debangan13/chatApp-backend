import { Router } from "express";
import { authenticatedUser } from "../middlewares/authentication.js";
import { getMessage } from "../controllers/MessageController.js";
const router = Router()

router.post('/get-messages',authenticatedUser,getMessage)

export default router