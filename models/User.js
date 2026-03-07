const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // 1. Basic Identity
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // 2. The Financial Profile (The Agent's Context)
    financialProfile: {
      annualIncome: { type: Number, default: 0 },
      riskTolerance: {
        type: String,
        enum: ["Low", "Medium", "High"], // Restricts input to these exact strings
        default: "Medium",
      },
      primaryGoal: { type: String, default: "General Savings" },
    },

    // 3. The Agent's Memory (Conversation History)
    chatHistory: [
      {
        role: {
          type: String,
          enum: ["user", "agent", "system"], // 'system' is for hidden AI instructions
          required: true,
        },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

module.exports = mongoose.model("User", userSchema);
