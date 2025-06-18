

require("dotenv").config()
const express = require("express")
const connectDB = require("./config/db.js")
const cors =require("cors")
const userRouter = require("./controller/user.controller.js")
const profileRouter = require("./controller/profile.controller.js")
const app = express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json())

// route
app.use("/user" , userRouter)
app.use("/profile" , profileRouter)

// health router
app.get("/" ,(req , res)=>{
    res.send("connected!")
})

// unaviable router!
app.use((req , res)=>{
    res.send("Path not found!")
})
const PORT = process.env.PORT
app.listen(3000 , async()=>{
    await connectDB()
    console.log(`server run on ${PORT}`)
})