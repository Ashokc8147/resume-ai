import { Router } from 'express'
import { register, login, getMe } from '../controllers/auth.controller'
import { protect } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware'
import { registerSchema, loginSchema } from '../validators/auth.validator'
import { authLimiter } from '../middlewares/rateLimit.middleware'

const router = Router()

router.post('/register', authLimiter, validate(registerSchema), register)
router.post('/login', authLimiter, validate(loginSchema), login)
router.get('/me', protect, getMe)

export default router
