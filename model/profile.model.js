

const mongoose = require("mongoose")
const profileSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId , ref:"User" , required:true},
    fullname:{type:String},
    bio:{type:String},
    imageUrl:{type:String}
},{
    versionKey:false,
    timestamps:true
})

const Profile = mongoose.model("Profile" , profileSchema)
module.exports = Profile