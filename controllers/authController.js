const AuthService = require("../services/AuthService");
const jwt = require("jsonwebtoken");

class AuthController {
  // Helper method: This stays in the Controller because Cookies and HTTP Statuses are Controller jobs!
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
          financialProfile: user.financialProfile,
        },
      });
  };

  register = async (req, res) => {
    try {
      // Pass the pure data down to the Service
      const user = await AuthService.registerUser(req.body);

      // Handle the HTTP response
      this.sendTokenResponse(user, 201, res);
    } catch (error) {
      const statusCode = error.message.includes("already exists") ? 400 : 500;
      res.status(statusCode).json({ success: false, error: error.message });
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

      const user = await AuthService.loginUser(email, password);
      this.sendTokenResponse(user, 200, res);
    } catch (error) {
      const statusCode = error.message === "Invalid credentials" ? 401 : 500;
      res.status(statusCode).json({ success: false, error: error.message });
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
      // req.user.id is securely provided by your protect middleware
      const user = await AuthService.getUserById(req.user.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  };
}

module.exports = new AuthController();
