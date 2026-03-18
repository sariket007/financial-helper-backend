const User = require("../models/User");

class AuthService {
  async registerUser(userData) {
    const { name, email, password, role, financialProfile } = userData;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists with this email.");
    }

    // 2. Create the user
    const user = await User.create({
      name,
      email,
      password,
      role,
      financialProfile,
      // Leaving your chat history array here in case you need it for your fintech app!
      chatHistory: [{ role: "system", message: "Account securely created." }],
    });

    return user;
  }

  async loginUser(email, password) {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // 2. Check if password matches using your Model's custom method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return user;
  }

  async getUserById(userId) {
    // We strip the password out here so it never accidentally leaks to the frontend
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

module.exports = new AuthService();
