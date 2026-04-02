
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

/**
 * ✅ CORS CONFIG (handles Vercel + local)
 */
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // allow all Vercel deployments + localhost
    if (
      origin.includes("vercel.app") ||
      origin.includes("localhost")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

/**
 * ✅ IMPORTANT: CORS must come BEFORE everything
 */
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/**
 * ✅ Body parser
 */
app.use(express.json());

/**
 * ✅ Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/ai", aiRoutes);

/**
 * ✅ Health check
 */
app.get("/", (req, res) => {
  res.send("API Running");
});

/**
 * ✅ MongoDB Connection
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/**
 * ✅ Server start
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
/*const express = require("express");
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
/*
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
);*/
