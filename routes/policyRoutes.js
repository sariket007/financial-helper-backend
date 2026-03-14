const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policyController");
const { protect } = require("../middleware/authMiddleware");

// ==========================================
// 1. PUBLIC ROUTES (React Storefront)
// ==========================================

// GET /api/policies/public -> Returns ONLY active policies
router.get("/public", policyController.getPublicPolicies);

// GET /api/policies/12345abcde -> Returns a single policy's details
router.get("/:id", policyController.getPolicyById);

// ==========================================
// 2. PROTECTED ROUTES (Admin Dashboard)
// ==========================================

// GET /api/policies -> Returns ALL policies (active and inactive)
router.get("/", protect, policyController.getAllPolicies);

// POST /api/policies -> Creates a new policy package
router.post("/", protect, policyController.createPolicy);

// PUT /api/policies/12345abcde -> Updates the whole policy (price, name, etc.)
router.put("/:id", protect, policyController.updatePolicy);

// PATCH /api/policies/12345abcde/toggle -> Soft deletes/restores a policy
router.patch("/:id/toggle", protect, policyController.togglePolicyStatus);

module.exports = router;
