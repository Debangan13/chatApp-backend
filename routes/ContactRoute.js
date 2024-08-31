import { Router } from "express";
import { getContactsFromDmList, searchContacts } from "../controllers/ContactController.js"
import { authenticatedUser } from "../middlewares/authentication.js"
const router = Router()

router.post('/search',authenticatedUser,searchContacts)
router.get('/get-contact-for-DM',authenticatedUser,getContactsFromDmList)

export default router