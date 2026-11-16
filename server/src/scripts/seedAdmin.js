import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectDatabase, disconnectDatabase } from '../config/database.js'
import User from '../models/User.js'

async function seedAdmin() {
  const name = process.env.ADMIN_NAME
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim()
  const plainPassword = process.env.ADMIN_PASSWORD

  if (!email || !plainPassword || !name) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in server/.env.')
  }
  if (plainPassword.length < 12 || plainPassword.length > 72) {
    throw new Error('ADMIN_PASSWORD must contain between 12 and 72 characters.')
  }

  await connectDatabase()
  const existingUser = await User.findOne({ email })

  if (existingUser) {
    if (existingUser.role === 'admin') {
      console.log('An administrator with this email already exists. No changes made.')
      return
    }
    throw new Error('This email already belongs to a customer. Choose a different ADMIN_EMAIL.')
  }

  const password = await bcrypt.hash(plainPassword, 12)
  await User.create({ name, email, password, role: 'admin' })
  console.log('Administrator account created for ' + email)
}

seedAdmin()
  .catch((error) => {
    console.error('Admin setup failed:', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnectDatabase()
  })
