const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware"); // 1. Import the middleware

// 2. Add 'protect' as the second argument. The request must pass this before hitting the controller.
router.post("/advice/:userId", protect, aiController.getFinancialAdvice);

module.exports = router;
