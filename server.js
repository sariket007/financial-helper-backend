require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes"); // 1. Import Auth Routes

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// 2. Mount the routes
app.use("/api/auth", authRoutes); // Handles /api/auth/register and /api/auth/login
app.use("/api", aiRoutes); // Handles /api/advice/:userId

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Financial Helper server is Running!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
