const express = require("express");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const Profile = require("../model/profile.model");
const NodeCache = require("node-cache");
const multer = require("multer");
const router = express.Router();

// 5 min cache
const profileCache = new NodeCache({ stdTTL: 300 });

// GET Profile
router.get("/", auth, async (req, res) => {
  try {
    const cacheKey = `profile_${req.user._id}`;
    const cached = profileCache.get(cacheKey);

    if (cached) return res.status(200).json({ profile: cached });

    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) return res.status(404).json({ message: "Profile not found!" });

    profileCache.set(cacheKey, profile);
    return res.status(200).json({ profile });
  } catch (err) {
    console.error("GET Profile Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST/UPDATE Profile
router.post("/save", auth, upload.single("profileImage"), async (req, res) => {
  try {
    const { fullname, bio } = req.body;

    if (!fullname || !bio) {
      return res.status(400).json({ message: "Fullname and bio are required" });
    }

    const profileData = {
      userId: req.user._id,
      fullname,
      bio,
      ...(req.file && { imageUrl: req.file.path })
    };

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user._id },
      profileData,
      { new: true, upsert: true, runValidators: true }
    );

    profileCache.del(`profile_${req.user._id}`);

    return res.status(201).json({ message: "Profile saved", profile });
  } catch (err) {
    console.error("Save Profile Error:", err);

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Image exceeds 1MB limit" });
      }
      return res.status(400).json({ message: "File upload error", error: err.message });
    }

    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
