import Task from '../models/Task.js'

// Create task
export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body)
    res.status(201).json(task)
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({ message: error.message })
  }
}

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message })
  }
}

// Update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' })
    res.json(task)
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({ message: error.message })
  }
}

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' })
    res.json({ message: 'Tarea eliminada correctamente' })
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ message: error.message })
  }
}