import express from 'express'
import multer from 'multer'
import cloudinary from '../config/cloudinary.js'
import { Readable } from 'stream'

const router = express.Router()

const upload = multer({ storage: multer.memoryStorage() })

router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'kaushalpandey', resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        const readable = new Readable()
        readable.push(req.file.buffer)
        readable.push(null)
        readable.pipe(stream)
      })
    }
    
    const result = await streamUpload()
    res.json({ url: result.secure_url, publicId: result.public_id })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'kaushalpandey/videos', resource_type: 'video' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        const readable = new Readable()
        readable.push(req.file.buffer)
        readable.push(null)
        readable.pipe(stream)
      })
    }
    
    const result = await streamUpload()
    res.json({ url: result.secure_url, publicId: result.public_id })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'kaushalpandey/documents', resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        const readable = new Readable()
        readable.push(req.file.buffer)
        readable.push(null)
        readable.pipe(stream)
      })
    }
    
    const result = await streamUpload()
    res.json({ url: result.secure_url, publicId: result.public_id })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/generate-signature', async (req, res) => {
  try {
    const { folder = 'kaushalpandey/documents' } = req.body
    const timestamp = Math.round(Date.now() / 1000)
    const params = { timestamp, folder }
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET)
    res.json({
      signature,
      timestamp: String(timestamp),
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/:publicId', async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.params.publicId)
    res.json({ message: 'File deleted successfully', result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router