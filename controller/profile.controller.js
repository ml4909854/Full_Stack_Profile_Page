const express = require("express");
const auth = require("../middleware/auth.middleware.js");
const upload = require("../middleware/upload.middleware.js");
const Profile = require("../model/profile.model.js");

const router = express.Router();

// ✅ GET current user's profile
router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found!" });
    }

    return res.status(200).json({ profile });
  } catch (error) {
    console.error("GET Profile Error:", error);
    return res.status(500).json({ message: "Error fetching profile", error });
  }
});

// ✅ CREATE profile (1 profile per user)
router.post("/create", auth, upload.single("profileImage"), async (req, res) => {
  try {
    const { fullname, bio } = req.body;
    const userId = req.user._id;

    if (!fullname || !bio || !req.file) {
      return res.status(400).json({ message: "Fullname, bio, and image are required." });
    }

    // 🔒 Check if profile already exists for this user
    const existingProfile = await Profile.findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({ message: "Profile already exists for this user." });
    }

    const newProfile = new Profile({
      userId,
      fullname,
      bio,
      imageUrl: req.file.path,
    });

    const savedProfile = await newProfile.save();
    return res.status(201).json({ message: "Profile created successfully", profile: savedProfile });
  } catch (error) {
    console.error("Create Profile Error:", error);
    return res.status(500).json({ message: "Error creating profile", error });
  }
});

// ✅ UPDATE profile by ID
router.patch("/update/:id", auth, upload.single("profileImage"), async (req, res) => {
  try {
    const { fullname, bio } = req.body;
    const profileId = req.params.id;
    const userId = req.user._id;

    const existingProfile = await Profile.findById(profileId);

    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    // 🔐 Check ownership
    if (existingProfile.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this profile." });
    }

    // ✅ Update fields
    if (fullname) existingProfile.fullname = fullname;
    if (bio) existingProfile.bio = bio;
    if (req.file) existingProfile.imageUrl = req.file.path;

    const updatedProfile = await existingProfile.save();
    return res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Error updating profile", error });
  }
});

module.exports = router;
