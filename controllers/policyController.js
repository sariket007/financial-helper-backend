const PolicyPackageService = require("../services/PolicyPackageService");
class PolicyController {
  // 1. CREATE (Admin Only)
  async createPolicy(req, res) {
    try {
      const newPolicy = await PolicyPackageService.createPolicy(req.body);
      res.status(201).json({ success: true, data: newPolicy });
    } catch (error) {
      console.error("Error creating policy:", error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // 2. READ ALL (Admin Dashboard)
  async getAllPolicies(req, res) {
    try {
      const policies = await PolicyPackageService.getAllPolicies();
      res.status(200).json({ success: true, data: policies });
    } catch (error) {
      console.error("Error fetching all policies:", error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  }

  // 3. READ ACTIVE ONLY (Public Storefront)
  async getPublicPolicies(req, res) {
    try {
      // Notice how clean this is? The Service handles all the database filtering.
      const publicPolicies = await PolicyPackageService.getPublicPolicies();
      res.status(200).json({
        success: true,
        count: publicPolicies.length,
        data: publicPolicies,
      });
    } catch (error) {
      console.error("Error fetching public policies:", error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  }

  // 4. READ SINGLE
  async getPolicyById(req, res) {
    try {
      const policy = await PolicyPackageService.getPolicyById(req.params.id);
      if (!policy) {
        return res
          .status(404)
          .json({ success: false, error: "Policy not found" });
      }
      res.status(200).json({ success: true, data: policy });
    } catch (error) {
      console.error("Error fetching policy by ID:", error);
      // If they pass an invalid MongoDB ID format, Mongoose throws a CastError
      res.status(400).json({ success: false, error: "Invalid ID format" });
    }
  }

  // // 5. UPDATE
  // async updatePolicy(req, res) {
  //   try {
  //     const updatedPolicy = await PolicyPackageService.updatePolicy(
  //       req.params.id,
  //       req.body,
  //     );
  //     if (!updatedPolicy) {
  //       return res
  //         .status(404)
  //         .json({ success: false, error: "Policy not found" });
  //     }
  //     res.status(200).json({ success: true, data: updatedPolicy });
  //   } catch (error) {
  //     res.status(400).json({ success: false, error: error.message });
  //   }
  // }

  // PATCH /api/policies/:id
  updatePolicy = async (req, res) => {
    try {
      // The Controller just passes the ID and the Body to the Service
      const policy = await PolicyPackageService.updatePolicyById(
        req.params.id,
        req.body,
      );

      res.status(200).json({ success: true, data: policy });
    } catch (error) {
      console.error("Error updating policy:", error);
      // The Controller catches the error the Service threw, and formats the HTTP response
      const statusCode = error.message === "Policy not found" ? 404 : 400;
      res.status(statusCode).json({ success: false, error: error.message });
    }
  };

  // 6. TOGGLE STATUS (Soft Delete)
  async togglePolicyStatus(req, res) {
    try {
      const toggledPolicy = await PolicyPackageService.togglePolicyStatus(
        req.params.id,
      );
      res.status(200).json({
        success: true,
        message: `Policy is now ${toggledPolicy.isActive ? "Active" : "Inactive"}`,
        data: toggledPolicy,
      });
    } catch (error) {
      console.error("Error toggling policy status:", error);
      if (error.message === "Policy not found") {
        return res.status(404).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: "Server Error" });
    }
  }

  // Add this inside your PolicyController class
  deletePolicy = async (req, res) => {
    try {
      // The Controller stays clean and just calls the Service
      await PolicyPackageService.deletePolicyById(req.params.id);

      // Standard REST practice is to return an empty object {} on a successful delete
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      console.error("Error deleting policy:", error);
      const statusCode =
        error.message === "Policy package not found" ? 404 : 500;
      res.status(statusCode).json({ success: false, error: error.message });
    }
  };
}

module.exports = new PolicyController();
