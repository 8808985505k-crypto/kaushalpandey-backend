import express from 'express'
import Education from '../models/Education.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const education = await Education.find().sort({ startDate: -1 })
    res.json(education)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', authenticate, async (req, res) => {
  try {
    const education = new Education(req.body)
    await education.save()
    res.status(201).json(education)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id', authenticate, async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!education) return res.status(404).json({ message: 'Education not found' })
    res.json(education)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id)
    if (!education) return res.status(404).json({ message: 'Education not found' })
    res.json({ message: 'Education deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router