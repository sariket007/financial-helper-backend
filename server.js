require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 1. Import CORS
const connectDB = require('./config/db');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Enable CORS so React can talk to us
app.use(cors()); 
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
