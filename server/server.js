const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/ai", aiRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});