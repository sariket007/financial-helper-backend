const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the request has an authorization header starting with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Extract the token from the header (Format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in the database and attach them to the 'req' object
      // We use .select('-password') to ensure we don't accidentally pass the hash around
      req.user = await User.findById(decoded.id).select("-password");

      // 5. Let the request proceed to the AI Controller
      next();
    } catch (error) {
      console.error("Token Verification Failed:", error);
      res
        .status(401)
        .json({ success: false, error: "Not authorized, token failed." });
    }
  }

  // 6. If there is no token at all
  if (!token) {
    res
      .status(401)
      .json({ success: false, error: "Not authorized, no token provided." });
  }
};

module.exports = { protect };
