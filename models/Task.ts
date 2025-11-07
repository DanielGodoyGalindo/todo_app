import { Schema, model, models } from 'mongoose'

// Define the structure (schema) of a Task document
const TaskSchema = new Schema({
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  userEmail: {  type: String,  required: true}
}, { timestamps: true })

// Create a model based on the schema
// Mongoose automatically creates a collection named 'tasks' (plural form)
const Task = models.Task || model('Task', TaskSchema)
export default Task