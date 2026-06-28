const Question = require("../models/Question");
const { parsePagination } = require("../utils/pagination");

const listQuestions = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false, status: "Open" };
    if (req.query.stream) filter.stream = req.query.stream;
    if (req.query.search) filter.title  = new RegExp(req.query.search, "i");
    const [items, total] = await Promise.all([
      Question.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select("-answers.authorEmail"),
      Question.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const getQuestionById = async (req, res, next) => {
  try {
    const q = await Question.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $inc: { views: 1 } },
      { new: true }
    ).select("-answers.authorEmail");
    if (!q) return res.status(404).json({ message: "Not found" });
    res.json(q);
  } catch (err) { next(err); }
};

const createQuestion = async (req, res, next) => {
  try {
    const q = await Question.create(req.body);
    res.status(201).json(q);
  } catch (err) { next(err); }
};

const addAnswer = async (req, res, next) => {
  try {
    const q = await Question.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $push: { answers: req.body } },
      { new: true }
    ).select("-answers.authorEmail");
    if (!q) return res.status(404).json({ message: "Question not found" });
    res.status(201).json(q);
  } catch (err) { next(err); }
};

const deleteQuestion = async (req, res, next) => {
  try {
    await Question.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

const upvoteQuestion = async (req, res, next) => {
  try {
    const q = await Question.findByIdAndUpdate(req.params.id, { $inc: { upvotes: 1 } }, { new: true });
    res.json({ upvotes: q.upvotes });
  } catch (err) { next(err); }
};

module.exports = { listQuestions, getQuestionById, createQuestion, addAnswer, deleteQuestion, upvoteQuestion };
