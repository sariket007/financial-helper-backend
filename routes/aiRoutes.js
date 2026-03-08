const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// The route remains clean, but it's now pointing to a class method
router.post("/advice/:userId", aiController.getFinancialAdvice);

module.exports = router;
