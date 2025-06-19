const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedFormats.includes(file.mimetype)) {
      const err = new Error("Image file format not allowed");
      err.http_code = 400;
      throw err;
    }

    return {
      folder: "profiles",
      public_id: `${Date.now()}-${(req.user && req.user._id) || "unknown"}`,
      transformation: [
        { width: 150, height: 150, crop: "fill" },
        { quality: "auto:low" },
        { fetch_format: "auto" }
      ]
    };
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
});

module.exports = upload;
