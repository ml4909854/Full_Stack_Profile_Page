

require("dotenv").config()
const mongoose = require("mongoose")
const mongoUrl = process.env.mongoUrl

const connectDB = async()=>{
    try {
        await mongoose.connect(mongoUrl)
        console.log("db connected!")
    } catch (error) {
        console.log("db connected error!")
    }
}

module.exports = connectDB