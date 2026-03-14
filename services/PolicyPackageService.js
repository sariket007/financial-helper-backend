const PolicyPackage = require("../models/PolicyPackage");

class PolicyPackageService {
  // 1. CREATE (Admin Only)
  async createPolicy(policyData) {
    return await PolicyPackage.create(policyData);
  }

  // 2. READ ALL (Admin Dashboard - sees everything, active or inactive)
  async getAllPolicies() {
    // Sort by newest first so the admin sees their latest work at the top
    return await PolicyPackage.find({}).sort("-createdAt");
  }

  // 3. READ ACTIVE ONLY (Public React Storefront)
  async getPublicPolicies() {
    // THIS is how we filter at the database level.
    // Node.js only receives the active ones, saving massive amounts of RAM.
    return await PolicyPackage.find({ isActive: true }).sort("price"); // Sorts cheapest to most expensive
  }

  // 4. READ SINGLE
  async getPolicyById(id) {
    return await PolicyPackage.findById(id);
  }

  // 5. UPDATE
  async updatePolicy(id, updateData) {
    return await PolicyPackage.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  // 6. DELETE (Soft Delete Strategy)
  async togglePolicyStatus(id) {
    // We find the policy first to see what its current status is
    const policy = await PolicyPackage.findById(id);
    if (!policy) throw new Error("Policy not found");

    // Flip the boolean (if true, becomes false. If false, becomes true)
    policy.isActive = !policy.isActive;

    // Save it back to the database
    await policy.save();
    return policy;
  }
}

module.exports = new PolicyPackageService();
