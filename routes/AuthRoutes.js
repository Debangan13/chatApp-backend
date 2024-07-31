import { Router } from 'express'
const router = Router()

import { signup } from '../controllers/AuthControllers.js'

router.post('/signup',signup)

export default router