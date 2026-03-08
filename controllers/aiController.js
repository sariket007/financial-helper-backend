const User = require("../models/User");

class AiController {
  constructor(aiService) {
    // Dependency Injection: The controller relies on the service
    this.aiService = aiService;
  }

  // We use an arrow function here to bind 'this', preventing context loss in Express routing
  getFinancialAdvice = async (req, res) => {
    try {
      const { question } = req.body;
      const userId = req.params.userId;

      // 1. Fetch User Memory
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found." });
      }

      // 2. Save User Question
      user.chatHistory.push({ role: "user", message: question });

      // 3. Delegate to Service
      const aiResponse = await this.aiService.generateFinancialAdvice(
        user,
        question,
      );

      // 4. Save AI Response & Persist (THE FIX)
      user.chatHistory.push({ role: "agent", message: aiResponse });

      // Explicitly tell Mongoose the array changed
      user.markModified("chatHistory");

      await user.save();
      console.log(`[DB SUCCESS] Chat history saved for user: ${user._id}`); // Terminal confirmation

      // 5. Send Response
      res.status(200).json({
        success: true,
        client: user.name,
        questionAsked: question,
        advisorResponse: aiResponse,
      });
    } catch (error) {
      console.error("AiController Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
}

// Import the service and inject it into the controller
const aiServiceInstance = require("../services/AiService");
module.exports = new AiController(aiServiceInstance);
