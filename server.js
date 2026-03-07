require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const User = require("./models/User"); // 1. Import the User model

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Financial Helper server is Running!" });
});

// 2. The Test Route "Test case perform to make etry for user"
// app.get("/api/test-user", async (req, res) => {
//   try {
//     const testUser = new User({
//       name: "Test Investor",
//       // Using Date.now() ensures a unique email every time you refresh the page
//       email: `test${Date.now()}@example.com`,
//       contact: "9876543210",
//       financialProfile: {
//         annualIncome: 1500000, // ₹15 LPA
//         riskTolerance: "High",
//         primaryGoal: "Retirement Corpus",
//       },
//       chatHistory: [
//         {
//           role: "system",
//           message: "AI Agent initialized for new user.",
//         },
//       ],
//     });

//     const savedUser = await testUser.save(); // This actually writes to MongoDB

//     res.status(201).json({
//       success: true,
//       message: "Fake user created successfully!",
//       user: savedUser,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
