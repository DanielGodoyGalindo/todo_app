import mongoose from 'mongoose'

// Define the structure (schema) of a Task document
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'tasks' }
)

// Create a model based on the schema
// Mongoose automatically creates a collection named 'tasks' (plural form)
const Task = mongoose.model('Task', taskSchema)

export default Task