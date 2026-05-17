import express from 'express'
import Skill from '../models/Skill.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 })
    res.json(skills)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', authenticate, async (req, res) => {
  try {
    const skill = new Skill(req.body)
    await skill.save()
    res.status(201).json(skill)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id', authenticate, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!skill) return res.status(404).json({ message: 'Skill not found' })
    res.json(skill)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id)
    if (!skill) return res.status(404).json({ message: 'Skill not found' })
    res.json({ message: 'Skill deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router