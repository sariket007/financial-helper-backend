const jwt = require("jsonwebtoken");
const User = require("../models/User");

class AuthService {
  // Helper method to generate the JWT pass
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d", // Token expires in 30 days
    });
  }

  async registerUser(name, email, password, financialProfile) {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists with this email.");
    }

    // 2. Create the user (Mongoose will automatically hash the password here)
    const user = await User.create({
      name,
      email,
      password,
      financialProfile,
      chatHistory: [{ role: "system", message: "Account securely created." }],
    });

    // 3. Return the user data and their new token
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: this.generateToken(user._id),
    };
  }

  async loginUser(email, password) {
    // 1. Find user. We MUST use .select('+password') because we hid it in the model!
    const user = await User.findOne({ email }).select("+password");

    // 2. Check if user exists AND password matches our hash
    if (user && (await user.matchPassword(password))) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: this.generateToken(user._id),
      };
    } else {
      throw new Error("Invalid email or password.");
    }
  }
}

module.exports = new AuthService();
