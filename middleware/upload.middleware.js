
const multer = require("multer")
const cloudinary = require("../utils/cloudinary.js")
const {CloudinaryStorage} = require("multer-storage-cloudinary")

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"profiles",
        allowed_formats:["jpg" , "jpeg" , "png"]
    }
})

const upload  = multer({storage})
module.exports = upload