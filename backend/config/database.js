import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME || 'taskflow'

let client = null
let db = null

export const connectDB = async () => {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI)
      await client.connect()
      db = client.db(DB_NAME)
      console.log('✅ Connected to MongoDB successfully')
    }
    return db
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

export const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.')
  }
  return db
}

export const closeDB = async () => {
  if (client) {
    await client.close()
    client = null
    db = null
    console.log('MongoDB connection closed')
  }
}

