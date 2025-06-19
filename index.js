// index.js

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const multer = require("multer");
const userRouter = require("./controller/user.controller");
const profileRouter = require("./controller/profile.controller");

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/user", userRouter);
app.use("/profile", profileRouter);

app.get("/", (req, res) => {
  res.send("connected!");
});

app.use((req, res) => {
  res.status(404).send("Path not found!");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "Multer Error",
      error: err.message
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`server run on ${PORT}`);
});
