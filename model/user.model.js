
const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    email:{type:String , required:true , unique:true , lowecase:true , trim:true},
    password:{type:String , required:true, trim:true}
},{
    versionKey:false,
    timestamps:true
})

const User = mongoose.model("User" , userSchema)
module.exports = User