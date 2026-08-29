const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

/**
 * CORS CONFIG (handles Vercel + local dev + tools)
 */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin.includes("vercel.app") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1")
    ) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

/**
 * Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/ai", aiRoutes);

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("API Running");
});

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

/**
 * MongoDB Connection & Server start
 */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    // Start server even if Mongo is connecting so healthcheck responds
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (MongoDB connecting/failed)`);
    });
  });
