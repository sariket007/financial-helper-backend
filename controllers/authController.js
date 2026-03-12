class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  // Private helper method to handle secure cookie transport
  #sendTokenResponse(userData, statusCode, res) {
    // 1. Define strict cookie security options
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true, // CRITICAL: Prevents XSS attacks. JavaScript cannot read this.
      secure: process.env.NODE_ENV === "production", // Uses HTTPS in production
      sameSite: "strict", // Prevents CSRF attacks
    };

    // 2. Extract the token out of the payload so we don't expose it in the raw JSON response anymore
    const { token, ...userWithoutToken } = userData;

    // 3. Attach the cookie to the response and send the sanitized user data
    res
      .status(statusCode)
      .cookie("token", token, options)
      .json({ success: true, data: userWithoutToken });
  }

  register = async (req, res) => {
    try {
      const { name, email, password, financialProfile } = req.body;
      const userData = await this.authService.registerUser(
        name,
        email,
        password,
        financialProfile,
      );

      // Delegate to our private transport method
      this.#sendTokenResponse(userData, 201, res);
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const userData = await this.authService.loginUser(email, password);

      // Delegate to our private transport method
      this.#sendTokenResponse(userData, 200, res);
    } catch (error) {
      res.status(401).json({ success: false, error: error.message });
    }
  };

  logout = async (req, res) => {
    // To log out, we overwrite the cookie with a dummy value and expire it immediately
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  };
}

const authServiceInstance = require("../services/AuthService");
module.exports = new AuthController(authServiceInstance);
