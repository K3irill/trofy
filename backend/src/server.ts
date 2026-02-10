import { app } from './app'

const PORT = process.env.PORT || 3333

const start = async () => {
  try {
    console.log('☑️ Database connected ☑️')

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT} ✅`)
    })
  } catch (error) {
    console.error('🛑☠️🛑 Failed to start server 🛑☠️🛑:', error)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  process.exit(0)
})

process.on('SIGTERM', async () => {
  process.exit(0)
})

start()
