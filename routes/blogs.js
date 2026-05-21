import express from 'express'
import Blog from '../models/Blog.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { destination, published, limit = 20, skip = 0 } = req.query
    const query = {}
    if (destination) query.destinationSlug = destination
    if (published !== undefined) query.published = published === 'true'
    const blogs = await Blog
      .find(query)
      .select('title slug thumbnail excerpt createdAt destinationSlug')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    res.json(blog)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', authenticate, async (req, res) => {
  try {
    const blog = new Blog(req.body)
    await blog.save()
    res.status(201).json(blog)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id', authenticate, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json(blog)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router