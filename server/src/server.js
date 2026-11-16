import 'dotenv/config'
import app from './app.js'
import { connectDatabase, disconnectDatabase } from './config/database.js'

const port = Number(process.env.PORT) || 5000

async function startServer() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be a random secret with at least 32 characters.')
  }

  await connectDatabase()
  const server = app.listen(port, () => {
    console.log('MOMO SHOP RWANDA API listening on port ' + port)
  })

  async function shutdown(signal) {
    console.log(signal + ' received. Closing API server...')
    server.close(async () => {
      await disconnectDatabase()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

startServer().catch((error) => {
  console.error('Could not start API server:', error.message)
  process.exit(1)
})
