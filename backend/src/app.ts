import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express()

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:4444'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)
app.use(express.json())



export { app }
