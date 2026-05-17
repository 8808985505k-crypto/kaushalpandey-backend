import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import 'dotenv/config'
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const hashedPassword = bcrypt.hashSync(password, 12)
    const user = new User({ username, email, password: hashedPassword, role: 'admin' })
    await user.save()
    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ valid: true, user })
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' })
  }
})

export default router