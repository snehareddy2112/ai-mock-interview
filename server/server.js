const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Middleware
app.use(express.json());

// ✅ Proper CORS setup
/*app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ai-mock-interview-fawn-five.vercel.app",
      "https://ai-mock-interview-497fizg9j-snehareddy2112s-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);*/
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.includes("vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ ALSO IMPORTANT
app.options("*", cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API Running");
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
