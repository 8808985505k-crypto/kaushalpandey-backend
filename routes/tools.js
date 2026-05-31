import express from 'express'
import Tool from '../models/Tool.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const tools = await Tool.find().sort({ createdAt: -1 })
    res.json(tools)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', authenticate, async (req, res) => {
  try {
    const tool = new Tool(req.body)
    await tool.save()
    res.status(201).json(tool)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id', authenticate, async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!tool) return res.status(404).json({ message: 'Tool not found' })
    res.json(tool)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id)
    if (!tool) return res.status(404).json({ message: 'Tool not found' })
    res.json({ message: 'Tool deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
