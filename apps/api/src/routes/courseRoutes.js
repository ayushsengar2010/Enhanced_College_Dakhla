const express = require("express");
const {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");
const { requireAuth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", optionalAuth, listCourses);
router.post("/", requireAuth, createCourse);
router.put("/:id", requireAuth, updateCourse);
router.delete("/:id", requireAuth, deleteCourse);

module.exports = router;
