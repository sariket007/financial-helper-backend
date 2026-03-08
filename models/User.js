const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // 1. Import bcrypt

const userSchema = new mongoose.Schema(
  {
    // Basic Identity
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      // 2. Add the password field
      type: String,
      required: true,
      select: false, // This prevents the password from being returned in standard API queries
    },

    // The Financial Profile
    financialProfile: {
      annualIncome: { type: Number, default: 0 },
      riskTolerance: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
      },
      primaryGoal: { type: String, default: "General Savings" },
    },

    // The Agent's Memory
    chatHistory: [
      {
        role: {
          type: String,
          enum: ["user", "agent", "system"],
          required: true,
        },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// 3. Mongoose Pre-Save Hook for Password Hashing
// This runs automatically right before await user.save() is called
userSchema.pre("save", async function () {
  // If the password wasn't modified (like if we are just adding a chat message), exit the hook immediately
  if (!this.isModified("password")) {
    return;
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 4. Method to compare entered password with the hashed database password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
