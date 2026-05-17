import 'dotenv/config'

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaushalpandey'
export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
export const PORT = process.env.PORT || 5000
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || ''
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || ''
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || ''
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@kaushalpandey.co.in'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'