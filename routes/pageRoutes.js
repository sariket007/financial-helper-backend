const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");

// Import your authentication bouncer to protect the CMS operations
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// ==========================================
// 1. PUBLIC ROUTES (Anyone can read pages)
// ==========================================
// GET /api/pages -> Returns the lightweight list of all pages
router.get("/", pageController.getAllPages);

// GET /api/pages/about-us -> Returns the full single page object
router.get("/:slug", pageController.getPageBySlug);

// ==========================================
// 2. PROTECTED ROUTES (Only logged-in admins)
// ==========================================
// POST /api/pages -> Creates a new page
router.post(
  "/",
  protect,
  authorizeRoles("admin", "superadmin"),
  pageController.createPage,
);

// PUT /api/pages/12345abcde -> Updates a specific page by ID
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "superadmin"),
  pageController.updatePage,
);

// DELETE /api/pages/12345abcde -> Deletes a specific page by ID
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "superadmin"),
  pageController.deletePage,
);

module.exports = router;
