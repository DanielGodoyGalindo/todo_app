import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI!

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in environment variables')
}

export const connectToDB = async () => {
  try {
    // If there's already a connection, don't connect again
    if (mongoose.connection.readyState >= 1) {
      return
    }

    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}