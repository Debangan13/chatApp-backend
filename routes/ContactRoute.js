import { Router } from "express";
import { searchContacts } from "../controllers/ContactController.js"
import { authenticatedUser } from "../middlewares/authentication.js"
const router = Router()

router.post('/search',authenticatedUser,searchContacts)

export default router