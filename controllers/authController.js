const User = require("../models/User");
const jwt = require("jsonwebtoken");

class AuthController {
  sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || "30d",
      },
    );

    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    res
      .status(statusCode)
      .cookie("token", token, options)
      .json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          financialProfile: user.financialProfile, // Send profile back to React
        },
      });
  };

  register = async (req, res) => {
    try {
      // Extract the new nested data exactly as React sends it
      const { name, email, password, role, financialProfile } = req.body;

      const user = await User.create({
        name,
        email,
        password,
        role,
        financialProfile,
      });

      this.sendTokenResponse(user, 201, res);
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, error: "Please provide email and password" });
      }

      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(401)
          .json({ success: false, error: "Invalid credentials" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res
          .status(401)
          .json({ success: false, error: "Invalid credentials" });

      this.sendTokenResponse(user, 200, res);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  logout = async (req, res) => {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ success: true, data: {} });
  };

  getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: "Server Error" });
    }
  };
}

module.exports = new AuthController();
