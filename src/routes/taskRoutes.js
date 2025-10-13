import express from 'express'
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js'

const router = express.Router()

// Tasks routes
router.post('/create', createTask) // this is http://localhost:3000/api/tasks/create
router.get('/getall', getTasks);
router.put('/update/:id', updateTask);
router.delete('/delete/:id', deleteTask);

export default router