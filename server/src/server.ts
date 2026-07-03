import app from './app'
import { connectDB } from './config/db'
import { env } from './config/env'

const startServer = async (): Promise<void> => {
  try {
    await connectDB()

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`)
      console.log(`Environment: ${env.nodeEnv}`)
      console.log(`API base: http://localhost:${env.port}/api/v1`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
