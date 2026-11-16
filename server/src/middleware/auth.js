import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization || ''
    const [scheme, token] = authorization.split(' ')
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Sign in first.' })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.sub)
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'This account is unavailable. Contact the store administrator.' })
    }

    req.user = user
    return next()
  } catch {
    return res.status(401).json({ success: false, message: 'Your session is invalid or has expired. Sign in again.' })
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Administrator permission is required.' })
  }
  return next()
}
