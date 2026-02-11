import 'reflect-metadata'
import { app } from './app'
import { config } from './core/config'
import { prisma } from './shared/database'

const start = async () => {
  try {
    // Проверяем подключение к БД
    await prisma.$connect()
    console.log('☑️ Database connected ☑️')

    app.listen(config.server.port, () => {
      console.log(`✅ Server running on port ${config.server.port} ✅`)
    })
  } catch (error) {
    console.error('🛑☠️🛑 Failed to start server 🛑☠️🛑:', error)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

start()
