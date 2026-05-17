import express from 'express'
import Blog from '../models/Blog.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { destination, published } = req.query
    const query = {}
    if (destination) query.destinationSlug = destination
    if (published !== undefined) query.published = published === 'true'
    const blogs = await Blog.find(query).populate('author', 'name avatar').sort({ createdAt: -1 })
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name avatar')
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
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