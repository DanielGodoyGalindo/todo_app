import express, { json } from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import connect2DB from './src/config/db.js'
import router from './src/routes/routes.js'

config()
connect2DB()

const app = express()  
// Create an Express application instance

app.use(cors())  
// Enable CORS (Cross-Origin Resource Sharing) to allow requests from other origins (e.g., frontend running on a different port)

app.use(json())  
// Parse incoming requests with JSON payloads (so you can use req.body)


// By default all routes use /api/tasks
// To create a task, use "http://localhost:3000/api/tasks/create"
app.use('/api/tasks', router)  
// Use the router for all routes starting with /api/tasks
// For example, /api/tasks/create or /api/tasks/:id


const PORT = process.env.PORT || 3000  
// Define the port for the server (use environment variable if available, otherwise default to 3000)
app.listen(PORT, () => console.log(`Server running in port: ${PORT}`))  
// Start the server and log a message when it is running
