import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import { PORT, MONGODB_URI, FRONTEND_URL } from './config/index.js'

import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import blogRoutes from './routes/blogs.js'
import destinationRoutes from './routes/destinations.js'
import certificationRoutes from './routes/certifications.js'
import commentRoutes from './routes/comments.js'
import profileRoutes from './routes/profile.js'
import skillRoutes from './routes/skills.js'
import experienceRoutes from './routes/experiences.js'
import educationRoutes from './routes/education.js'
import betaAppRoutes from './routes/betaApps.js'
import toolRoutes from './routes/tools.js'
import uploadRoutes from './routes/upload.js'
import reviewRoutes from './routes/reviews.js'

const app = express()

app.use(helmet())
app.use(hpp())
app.use(cors({
  origin: true,
  credentials: true
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP, please try again later.' }
})
app.use('/api/', limiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/destinations', destinationRoutes)
app.use('/api/certifications', certificationRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/experiences', experienceRoutes)
app.use('/api/education', educationRoutes)
app.use('/api/beta-apps', betaAppRoutes)
app.use('/api/tools', toolRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/reviews', reviewRoutes)

app.get('/', (req, res) => {
  res.json({ status: 'OK', service: 'kaushalpandey-api' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    console.log('MongoDB connected successfully')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
}

startServer()