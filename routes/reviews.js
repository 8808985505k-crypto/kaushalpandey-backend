import express from 'express'
import Review from '../models/Review.js'

const router = express.Router()

router.get('/:blogId', async (req, res) => {
  try {
    const reviews = await Review.find({ blogId: req.params.blogId }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:blogId/counts', async (req, res) => {
  try {
    const [likes, comments] = await Promise.all([
      Review.countDocuments({ blogId: req.params.blogId, type: 'like' }),
      Review.countDocuments({ blogId: req.params.blogId, type: 'comment' }),
    ])
    res.json({ likes, comments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { blogId, type, name, content } = req.body
    if (!blogId || !type || !name) {
      return res.status(400).json({ message: 'blogId, type, and name are required' })
    }
    if (type === 'comment' && !content) {
      return res.status(400).json({ message: 'Content is required for comments' })
    }
    const review = new Review({ blogId, type, name, content })
    await review.save()
    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) return res.status(404).json({ message: 'Review not found' })
    res.json({ message: 'Review deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
