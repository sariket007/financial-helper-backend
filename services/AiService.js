const { GoogleGenerativeAI } = require("@google/generative-ai");

class AiService {
  constructor() {
    // Initialize the SDK once when the class is instantiated
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async generateFinancialAdvice(user, question) {
    const systemPrompt = `
            You are an elite financial advisor AI. 
            Client Name: ${user.name}.
            Income: ₹${user.financialProfile.annualIncome}.
            Risk Tolerance: ${user.financialProfile.riskTolerance}.
            Goal: ${user.financialProfile.primaryGoal}.
            
            Question: "${question}"
            
            Provide a professional, highly personalized, two-paragraph recommendation based strictly on this profile.
        `;

    const result = await this.model.generateContent(systemPrompt);
    return result.response.text();
  }
}

// Export a single instance (Singleton pattern) for memory efficiency
module.exports = new AiService();
