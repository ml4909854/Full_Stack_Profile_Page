require("dotenv").config()
const mongoose = require("mongoose")
const mongoUrl = process.env.MONGOURL // Ensure this matches your .env variable name

const connectDB = async() => {
    try {
        await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
            minPoolSize: 2,
            socketTimeoutMS: 45000
        })
        console.log("DB connected!")
    } catch (error) {
        console.error("DB connection error:", error.message)
        process.exit(1)
    }
}

module.exports = connectDB