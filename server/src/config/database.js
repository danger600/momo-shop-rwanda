import mongoose from 'mongoose'

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Check server/.env.')
  mongoose.set('strictQuery', true)
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  console.log('MongoDB connected:', mongoose.connection.name)
}

export async function disconnectDatabase() {
  await mongoose.disconnect()
}
