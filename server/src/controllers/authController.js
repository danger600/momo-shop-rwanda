import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function createToken(user) {
  return jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
  )
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function register(req, res) {
  const name = req.body.name.trim()
  const email = req.body.email.toLowerCase().trim()
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' })
  }

  const password = await bcrypt.hash(req.body.password, 12)
  const user = await User.create({ name, email, password, role: 'customer' })

  return res.status(201).json({
    success: true,
    message: 'Customer account created successfully.',
    data: { user: publicUser(user), token: createToken(user) },
  })
}

export async function login(req, res) {
  const email = req.body.email.toLowerCase().trim()
  const user = await User.findOne({ email }).select('+password')

  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, message: 'Email or password is incorrect.' })
  }

  const passwordMatches = await bcrypt.compare(req.body.password, user.password)
  if (!passwordMatches) {
    return res.status(401).json({ success: false, message: 'Email or password is incorrect.' })
  }

  return res.status(200).json({
    success: true,
    message: 'Signed in successfully.',
    data: { user: publicUser(user), token: createToken(user) },
  })
}

export function getCurrentUser(req, res) {
  return res.status(200).json({ success: true, data: { user: publicUser(req.user) } })
}
