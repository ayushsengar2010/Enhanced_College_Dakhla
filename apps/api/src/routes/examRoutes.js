const express = require("express");
const { listExams, getExamById, createExam, updateExam, deleteExam } = require("../controllers/examController");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/",       listExams);
router.get("/:id",    getExamById);
router.post("/",      requireAuth, createExam);
router.put("/:id",    requireAuth, updateExam);
router.delete("/:id", requireAuth, deleteExam);

module.exports = router;
