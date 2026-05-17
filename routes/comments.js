import express from 'express'
import Comment from '../models/Comment.js'

const router = express.Router()

router.get('/:blogId', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId }).sort({ createdAt: -1 })
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body)
    await comment.save()
    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/:id/reply', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) return res.status(404).json({ message: 'Comment not found' })
    comment.replies.push(req.body)
    await comment.save()
    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id)
    if (!comment) return res.status(404).json({ message: 'Comment not found' })
    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router