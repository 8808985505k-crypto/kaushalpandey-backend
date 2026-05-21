import express from 'express'
import BetaApp from '../models/BetaApp.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const query = req.query.all === 'true' ? {} : { active: true }
    const apps = await BetaApp.find(query).sort({ createdAt: -1 })
    res.json(apps)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', authenticate, async (req, res) => {
  try {
    const app = new BetaApp(req.body)
    await app.save()
    res.status(201).json(app)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id', authenticate, async (req, res) => {
  try {
    const app = await BetaApp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!app) return res.status(404).json({ message: 'Beta app not found' })
    res.json(app)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const app = await BetaApp.findByIdAndDelete(req.params.id)
    if (!app) return res.status(404).json({ message: 'Beta app not found' })
    res.json({ message: 'Beta app deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
