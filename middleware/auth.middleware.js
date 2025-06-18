require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/user.model.js");

const auth = async (req, res, next) => {
  try {
    
    const token = req.headers?.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded._id);

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error });
  }
};

module.exports = auth;
