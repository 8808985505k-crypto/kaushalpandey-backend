import express from 'express'
import Profile from '../models/Profile.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne()
    if (!profile) {
      profile = new Profile({
        name: 'Kaushal Pandey',
        title: 'Full Stack Developer',
        bio: 'Passionate full stack developer specializing in Java, Spring Boot, and MERN Stack.',
        socialLinks: {}
      })
      await profile.save()
    }
    res.json(profile)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/', authenticate, async (req, res) => {
  try {
    let profile = await Profile.findOne()
    if (!profile) {
      profile = new Profile(req.body)
    } else {
      profile.set(req.body)
    }
    await profile.save()
    res.json(profile)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router