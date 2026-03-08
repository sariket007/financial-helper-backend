class AuthController {
  constructor(authService) {
    this.authService = authService;
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

      res.status(201).json({ success: true, data: userData });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const userData = await this.authService.loginUser(email, password);

      res.status(200).json({ success: true, data: userData });
    } catch (error) {
      res.status(401).json({ success: false, error: error.message });
    }
  };
}

const authServiceInstance = require("../services/AuthService");
module.exports = new AuthController(authServiceInstance);
