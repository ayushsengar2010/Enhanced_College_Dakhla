const express = require("express");
const { listQuestions, getQuestionById, createQuestion, addAnswer, deleteQuestion, upvoteQuestion } = require("../controllers/questionController");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/",              listQuestions);
router.get("/:id",           getQuestionById);
router.post("/",             createQuestion);         // public
router.post("/:id/answers",  addAnswer);              // public
router.post("/:id/upvote",   upvoteQuestion);         // public
router.delete("/:id",        requireAuth, deleteQuestion);

module.exports = router;
