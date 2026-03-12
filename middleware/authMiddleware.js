const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // 1. Look for the token inside the newly parsed cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Not authorized, no token provided." });
  }

  try {
    // 2. Verify the cookie token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user to request
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.error("Token Verification Failed:", error);
    return res
      .status(401)
      .json({ success: false, error: "Not authorized, token failed." });
  }
};

module.exports = { protect };
