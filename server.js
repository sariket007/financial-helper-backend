require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");

const User = require("./models/User"); // Database layer

const { GoogleGenerativeAI } = require("@google/generative-ai"); // 1. Import the AI SDK

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// app.get("/api/health", (req, res) => {
//   res.status(200).json({ message: "Financial Helper server is Running!" });
// });

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

// 2. Initialize the AI using your hidden environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Very initial steps to test the backend running.
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Financial Helper server is Running!" });
});

// 3. The AI Test Route
app.get("/api/test-ai", async (req, res) => {
  try {
    // We use the 'flash' model because it is highly optimized for fast, text-based tasks
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Define a strict, persona-driven prompt for our FinTech use case
    const prompt =
      "You are an expert financial advisor AI. Write a professional, highly engaging two-sentence welcome message for a new user logging into a wealth management platform.";

    // Execute the call to the AI
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Send the AI's response back to the browser
    res.status(200).json({
      success: true,
      promptUsed: prompt,
      aiResponse: responseText,
    });
  } catch (error) {
    console.error("AI Integration Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. The Agentic Advice Route
app.post("/api/advice/:userId", async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.params.userId;

    // Step A: Fetch the Memory (Database)
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found in database." });
    }

    // Step B: Build the Context-Aware Prompt
    // This is where the magic happens. We inject the database values directly into the AI's brain.
    const systemPrompt = `
            You are an elite financial advisor AI. 
            Your client's name is ${user.name}.
            Their annual income is ₹${user.financialProfile.annualIncome}.
            Their risk tolerance is ${user.financialProfile.riskTolerance}.
            Their primary financial goal is: ${user.financialProfile.primaryGoal}.
            
            The client is asking you this question: "${question}"
            
            Based strictly on their financial profile, provide a professional, highly personalized, two-paragraph recommendation. Do not give generic advice.
        `;

    // Step C: Call the Brain (LLM)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(systemPrompt);
    const aiResponse = result.response.text();

    // Step D: Return the completed solution
    res.status(200).json({
      success: true,
      client: user.name,
      questionAsked: question,
      advisorResponse: aiResponse,
    });
  } catch (error) {
    console.error("Agent Logic Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
