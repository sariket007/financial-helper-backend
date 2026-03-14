require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 1. Import CORS
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes'); 
const policyRoutes = require('./routes/policyRoutes'); // 2. Import the new policy routes

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Update CORS to explicitly allow credentials (cookies) from your React frontend
app.use(cors({
    origin: 'http://localhost:5173', // Must be exact URL, no trailing slash
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 2. Mount the routes
app.use("/api/auth", authRoutes); // Handles /api/auth/register and /api/auth/login
app.use("/api", aiRoutes); // Handles /api/advice/:userId
app.use('/api/pages', pageRoutes); // Check spelling: 'pages' with an 's'
app.use('/api/policies', policyRoutes); // Mount the policy routes at /api/policies

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Financial Helper server is Running!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
