const express = require("express");
const {
  listColleges,
  getCollegeBySlug,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege
} = require("../controllers/collegeController");
const { requireAuth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", optionalAuth, listColleges);
router.get("/slug/:slug", optionalAuth, getCollegeBySlug);
router.get("/:id", requireAuth, getCollegeById);
router.post("/", requireAuth, createCollege);
router.put("/:id", requireAuth, updateCollege);
router.delete("/:id", requireAuth, deleteCollege);

module.exports = router;
