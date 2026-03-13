const PageService = require("../services/pageService"); // Import the Service we just built

class PageController {
  // 1. CREATE
  async createPage(req, res) {
    try {
      // We pass the raw JSON payload (req.body) to the Service
      const newPage = await PageService.createPage(req.body);
      // 201 means "Created successfully"
      res.status(201).json({ success: true, data: newPage });
    } catch (error) {
      // 400 means "Bad Request" (e.g., they forgot the title)
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // 2. READ (All)
  async getAllPages(req, res) {
    try {
      const pages = await PageService.getAllPages();
      // 200 means "OK"
      res.status(200).json({ success: true, data: pages });
    } catch (error) {
      res.status(500).json({ success: false, error: "Server Error" });
    }
  }

  // 3. READ (Single by Slug)
  async getPageBySlug(req, res) {
    try {
      // Extract the slug from the URL (e.g., /api/pages/about-us -> req.params.slug)
      const page = await PageService.getPageBySlug(req.params.slug);

      // CRITICAL: Mongoose doesn't throw an error if it simply can't find the page. It returns null.
      if (!page) {
        return res
          .status(404)
          .json({ success: false, error: "Page not found" });
      }

      res.status(200).json({ success: true, data: page });
    } catch (error) {
      res.status(500).json({ success: false, error: "Server Error" });
    }
  }

  // 4. UPDATE
  async updatePage(req, res) {
    try {
      // We need BOTH the ID from the URL (params) and the new data (body)
      const updatedPage = await PageService.updatePage(req.params.id, req.body);

      if (!updatedPage) {
        return res
          .status(404)
          .json({ success: false, error: "Page not found" });
      }

      res.status(200).json({ success: true, data: updatedPage });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // 5. DELETE
  async deletePage(req, res) {
    try {
      const deletedPage = await PageService.deletePage(req.params.id);

      if (!deletedPage) {
        return res
          .status(404)
          .json({ success: false, error: "Page not found" });
      }

      // We can send an empty object {} on delete, just confirming it worked
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: "Server Error" });
    }
  }
}

// Export a single instance
module.exports = new PageController();
