const Page = require("../models/Page"); // Import the schema we built yesterday

class PageService {
  // 1. CREATE
  async createPage(pageData) {
    // .create() validates against your Schema and saves to MongoDB in one step
    return await Page.create(pageData);
  }

  // 2. READ (All)
  async getAllPages() {
    // .find({}) returns an array of all documents.
    // We use .select() to exclude heavy content if we only need a list for the admin table
    return await Page.find({}).select("title slug status createdAt");
  }

  // 3. READ (Single by Slug - for the public React storefront)
  async getPageBySlug(slug) {
    // .findOne() returns a single object. Perfect for routing /about-us
    return await Page.findOne({ slug: slug });
  }

  // 4. UPDATE
  async updatePage(id, updateData) {
    // findByIdAndUpdate needs specific options to behave correctly
    return await Page.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the UPDATED document, not the old one
      runValidators: true, // Forces Mongoose to re-check your schema rules (like min/max length)
    });
  }

  // 5. DELETE
  async deletePage(id) {
    return await Page.findByIdAndDelete(id);
  }
}

// Exporting as a Singleton so the entire app shares one instance
module.exports = new PageService();
