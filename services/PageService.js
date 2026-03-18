const Page = require("../models/Page");

class PageService {
  // --- HELPER: The Dynamic Slug Generator ---
  async generateUniqueSlug(title, currentId = null) {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace spaces/special chars with hyphens
      .replace(/(^-|-$)+/g, ""); // Remove leading or trailing hyphens

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const query = { slug };
      if (currentId) query._id = { $ne: currentId };

      const existingPage = await Page.findOne(query);
      if (!existingPage) break; // Unique slug found!

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  // --- CRUD OPERATIONS ---
  async createPage(pageData) {
    // Generate the slug automatically based on the title BEFORE saving
    pageData.slug = await this.generateUniqueSlug(pageData.title);
    return await Page.create(pageData);
  }

  // Admin gets everything. Storefront only gets 'published' pages.
  async getAllPages(isAdmin = false) {
    const query = isAdmin ? {} : { status: "published" };
    // return await Page.find(query).select("-content").sort({ createdAt: -1 });
    return await Page.find(query).sort({ createdAt: -1 });
  }

  async getPageBySlug(slug) {
    // Only return the page to the public if it is published!
    return await Page.findOne({ slug, status: "published" });
  }

  async updatePage(id, updateData) {
    // If they changed the title, we must generate a new, safe slug
    if (updateData.title) {
      updateData.slug = await this.generateUniqueSlug(updateData.title, id);
    }

    return await Page.findByIdAndUpdate(id, updateData, {
      // new: true,
      returnDocument: "after", // <--- THE FIX IS HERE
      runValidators: true,
    });
  }

  async deletePage(id) {
    return await Page.findByIdAndDelete(id);
  }
}

module.exports = new PageService();
