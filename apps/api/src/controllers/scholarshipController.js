const Scholarship = require("../models/Scholarship");
const { parsePagination } = require("../utils/pagination");
const { safeRegex } = require("../utils/validation");

const listScholarships = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };
    if (!req.user) filter.isActive = true;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.stream) filter.stream = req.query.stream;
    if (req.query.search) filter.name = safeRegex(req.query.search);
    const [items, total] = await Promise.all([
      Scholarship.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Scholarship.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const getScholarshipById = async (req, res, next) => {
  try {
    const s = await Scholarship.findOne({ _id: req.params.id, isDeleted: false });
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json(s);
  } catch (err) { next(err); }
};

const createScholarship = async (req, res, next) => {
  try {
    const s = await Scholarship.create(req.body);
    res.status(201).json(s);
  } catch (err) { next(err); }
};

const updateScholarship = async (req, res, next) => {
  try {
    const s = await Scholarship.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json(s);
  } catch (err) { next(err); }
};

const deleteScholarship = async (req, res, next) => {
  try {
    const s = await Scholarship.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

module.exports = { listScholarships, getScholarshipById, createScholarship, updateScholarship, deleteScholarship };
