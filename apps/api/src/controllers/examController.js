const Exam = require("../models/Exam");
const { parsePagination } = require("../utils/pagination");

const listExams = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };
    if (req.query.stream) filter.stream = req.query.stream;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.examName = new RegExp(req.query.search, "i");
    const [items, total] = await Promise.all([
      Exam.find(filter).sort({ applicationEnd: 1 }).skip(skip).limit(limit),
      Exam.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findOne({ _id: req.params.id, isDeleted: false });
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (err) { next(err); }
};

const createExam = async (req, res, next) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (err) { next(err); }
};

const updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true, runValidators: true });
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (err) { next(err); }
};

const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

module.exports = { listExams, getExamById, createExam, updateExam, deleteExam };
