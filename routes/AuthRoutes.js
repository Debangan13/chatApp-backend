import { Router } from 'express'
import { getUserInfo, login, signup,updateProfile } from '../controllers/AuthControllers.js'
import { authenticatedUser } from '../middlewares/authentication.js'

const router = Router()

router.post('/signup',signup)
router.post('/login',login)
router.get('/user-info',authenticatedUser,getUserInfo)
router.post('/update-profile',authenticatedUser,updateProfile)

export default router