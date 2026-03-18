const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// ==========================================
// 1. PUBLIC ROUTES (Storefront)
// ==========================================
// Get only published pages (for the top menu)
router.get("/public", pageController.getPublicPages);

// Get a specific page by its slug (e.g., /about-us)
router.get("/public/:slug", pageController.getSinglePage);

// ==========================================
// 2. PROTECTED ROUTES (Admin CMS)
// ==========================================
// Get ALL pages (Drafts included) for the admin data table
router.get(
  "/",
  protect,
  authorizeRoles("admin", "superadmin"),
  pageController.getAdminPages,
);

router.post(
  "/",
  protect,
  authorizeRoles("admin", "superadmin"),
  pageController.createPage,
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "superadmin"),
  pageController.updatePage,
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "superadmin"),
  pageController.deletePage,
);

module.exports = router;
