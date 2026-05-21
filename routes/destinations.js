import express from 'express'
import Destination from '../models/Destination.js'
import Blog from '../models/Blog.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { featured, limit = 20, skip = 0 } = req.query
    const query = {}
    if (featured !== undefined) query.featured = featured === 'true'
    const destinations = await Destination
      .find(query)
      .select('name slug bannerImage thumbnail location tags featured createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    res.json(destinations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const destination = await Destination.findOne({ slug: req.params.slug })
    if (!destination) return res.status(404).json({ message: 'Destination not found' })
    const blogs = await Blog
      .find({ destinationSlug: req.params.slug, published: true })
      .select('title slug thumbnail excerpt createdAt')
      .sort({ createdAt: -1 })
    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    res.json({ ...destination.toObject(), blogs })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', authenticate, async (req, res) => {
  try {
    const destination = new Destination(req.body)
    await destination.save()
    res.status(201).json(destination)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id', authenticate, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!destination) return res.status(404).json({ message: 'Destination not found' })
    res.json(destination)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id)
    if (!destination) return res.status(404).json({ message: 'Destination not found' })
    res.json({ message: 'Destination deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router