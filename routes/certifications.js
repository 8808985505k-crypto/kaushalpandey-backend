import express from 'express'
import Certification from '../models/Certification.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ createdAt: -1 })
    res.json(certifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id)
    if (!certification) return res.status(404).json({ message: 'Certification not found' })
    res.json(certification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', authenticate, async (req, res) => {
  try {
    const certification = new Certification(req.body)
    await certification.save()
    res.status(201).json(certification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id', authenticate, async (req, res) => {
  try {
    const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!certification) return res.status(404).json({ message: 'Certification not found' })
    res.json(certification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id)
    if (!certification) return res.status(404).json({ message: 'Certification not found' })
    res.json({ message: 'Certification deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router