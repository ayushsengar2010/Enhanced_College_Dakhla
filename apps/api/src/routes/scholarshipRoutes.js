const express = require("express");
const { listScholarships, getScholarshipById, createScholarship, updateScholarship, deleteScholarship } = require("../controllers/scholarshipController");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/",       optionalAuth, listScholarships);
router.get("/:id",    getScholarshipById);
router.post("/",      requireAuth, createScholarship);
router.put("/:id",    requireAuth, updateScholarship);
router.delete("/:id", requireAuth, deleteScholarship);

module.exports = router;
