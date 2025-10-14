import { connect } from 'mongoose'
// Mongoose is an Object Data Modeling (ODM) library for MongoDB

// Database connection
const connect2DB = async () => {
    try {
        // Opens Mongoose's default connection to MongoDB
        if (process.env.MONGO_URI) {
            await connect(process.env.MONGO_URI)
        }
        console.log('MongoDB succesfully connected!')
    } catch (error) {
        if (error instanceof Error)
            console.error('Error while trying to connect to MongoDB:', error.message)
        else
            console.error('Unexpected error while trying to connect to MongoDB:', error)
        process.exit(1)
    }
}

export default connect2DB