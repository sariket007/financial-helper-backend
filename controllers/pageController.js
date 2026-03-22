const PageService = require("../services/PageService");

class PageController {
  createPage = async (req, res) => {
    try {
      const newPage = await PageService.createPage(req.body);
      res.status(201).json({ success: true, data: newPage });
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(400).json({ success: false, error: error.message });
    }
  };

  // ADMIN: Get all pages (Drafts + Published)
  getAdminPages = async (req, res) => {
    try {
      const pages = await PageService.getAllPages(true);
      res.status(200).json({ success: true, data: pages });
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  };

  // PUBLIC: Get only published pages for the Navbar
  getPublicPages = async (req, res) => {
    try {
      const pages = await PageService.getAllPages(false);
      res.status(200).json({ success: true, data: pages });
    } catch (error) {
      console.error("Error fetching public pages:", error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  };

  getSinglePage = async (req, res) => {
    try {
      const page = await PageService.getPageBySlug(req.params.slug);
      if (!page) {
        return res.status(404).json({
          success: false,
          error: "Page not found or is still a draft",
        });
      }
      res.status(200).json({ success: true, data: page });
    } catch (error) {
      console.error("Error fetching single page:", error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  };

  updatePage = async (req, res) => {
    try {
      const updatedPage = await PageService.updatePage(req.params.id, req.body);
      if (!updatedPage) {
        return res
          .status(404)
          .json({ success: false, error: "Page not found" });
      }
      res.status(200).json({ success: true, data: updatedPage });
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(400).json({ success: false, error: error.message });
    }
  };

  deletePage = async (req, res) => {
    try {
      const deletedPage = await PageService.deletePage(req.params.id);
      if (!deletedPage) {
        return res
          .status(404)
          .json({ success: false, error: "Page not found" });
      }
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  };
}

module.exports = new PageController();
