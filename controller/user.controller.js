require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../model/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//  REGISTER Route
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists! Try a different email!" });
    }

    // Hash the password
    const SALTROUND = parseInt(process.env.SALTROUND);
    const hashPassword = await bcrypt.hash(password, SALTROUND);

    // Save the user
    const newUser = new User({ email, password: hashPassword });
    const savedUser = await newUser.save();

       res
      .status(201)
      .json({ message: "User registered successfully!", user: savedUser });
  } catch (error) {
    res.status(500).json({ message: "Register error!", error: error });
  }
});

// LOGIN Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found! Please register first!" });
    }

   
    const isComparePassword = await bcrypt.compare(password, user.password);
    if (!isComparePassword) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    // Generate JWT Token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "2d",
    });

    res.status(200).json({ message: "Login successful!", token , userId:user._id } , {expiresIn:"1d"});
  } catch (error) {
    res.status(500).json({ message: "Login error!", error: error });
  }
});

module.exports = router;
