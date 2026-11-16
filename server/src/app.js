import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('This website origin is not allowed by CORS.'))
  },
}))
app.use(express.json({ limit: '20kb' }))

app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1
  return res.status(connected ? 200 : 503).json({
    success: connected,
    status: connected ? 'ok' : 'database_unavailable',
    database: connected ? 'connected' : 'disconnected',
    service: 'MOMO SHOP RWANDA API',
  })
})

app.use('/api', rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
}))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use(notFound)
app.use(errorHandler)

export default app
