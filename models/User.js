const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // The RBAC Role
    role: {
      type: String,
      enum: ["customer", "admin", "superadmin"],
      default: "customer",
    },

    // Your custom nested profile MUST be defined here to save to the database
    financialProfile: {
      annualIncome: { type: Number },
      riskTolerance: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
      },
      primaryGoal: { type: String },
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password for login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
