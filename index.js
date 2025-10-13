import express, { json } from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import connect2DB from './src/config/db.js'
import taskRoutes from './src/routes/taskRoutes.js'

config()
connect2DB()

const app = express()
app.use(cors())
app.use(json())

// By default all routes use /api/tasks
// To create task use "http://localhost:3000/api/tasks/create"
app.use('/api/tasks', taskRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running in port: ${PORT}`))