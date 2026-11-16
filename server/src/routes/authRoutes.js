import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { getCurrentUser, login, register } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { loginSchema, registerSchema } from '../validation/schemas.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many sign-in attempts. Please try again later.' },
})

router.post('/register', authLimiter, validate(registerSchema), asyncHandler(register))
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(login))
router.get('/me', authenticate, asyncHandler(getCurrentUser))

export default router
