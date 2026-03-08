require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const aiRoutes = require("./routes/aiRoutes"); // Import routes

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Mount the routes
app.use("/api", aiRoutes);

// Basic health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Financial Helper server is Running!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
