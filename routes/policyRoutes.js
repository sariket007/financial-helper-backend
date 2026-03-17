const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policyController");

// 1. Import BOTH middlewares
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// === PUBLIC ROUTES ===
router.get("/public", policyController.getPublicPolicies);
router.get("/:id", policyController.getPolicyById);

// === PROTECTED ADMIN ROUTES ===
// Notice the chain: First 'protect' (Are you logged in?), THEN 'authorizeRoles' (Are you staff?)

// GET all policies (Admin Dashboard needs this)
router.get(
  "/",
  protect,
  authorizeRoles("admin", "superadmin"),
  policyController.getAllPolicies,
);

// CREATE a policy
router.post(
  "/",
  protect,
  authorizeRoles("admin", "superadmin"),
  policyController.createPolicy,
);

// // UPDATE a policy
// router.put(
//   "/:id",
//   protect,
//   authorizeRoles("admin", "superadmin"),
//   policyController.updatePolicy,
// );
router.patch(
  "/:id",
  protect,
  authorizeRoles("admin", "superadmin"),
  policyController.updatePolicy,
);

// TOGGLE a policy
router.patch(
  "/:id/toggle",
  protect,
  authorizeRoles("admin", "superadmin"),
  policyController.togglePolicyStatus,
);

// Make sure this exists in your router file!
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "superadmin"),
  policyController.deletePolicy,
);

module.exports = router;
