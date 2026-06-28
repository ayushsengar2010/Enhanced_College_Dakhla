const StudyMaterial = require("../models/StudyMaterial");
const { parsePagination } = require("../utils/pagination");

const listStudyMaterials = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };
    if (req.query.stream)   filter.stream = req.query.stream;
    if (req.query.type)     filter.type   = req.query.type;
    if (req.query.examName) filter.examName = new RegExp(req.query.examName, "i");
    if (req.query.search)   filter.title    = new RegExp(req.query.search, "i");
    const [items, total] = await Promise.all([
      StudyMaterial.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      StudyMaterial.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const getStudyMaterialById = async (req, res, next) => {
  try {
    const m = await StudyMaterial.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $inc: { downloads: 1 } },
      { new: true }
    );
    if (!m) return res.status(404).json({ message: "Not found" });
    res.json(m);
  } catch (err) { next(err); }
};

const createStudyMaterial = async (req, res, next) => {
  try {
    const m = await StudyMaterial.create(req.body);
    res.status(201).json(m);
  } catch (err) { next(err); }
};

const updateStudyMaterial = async (req, res, next) => {
  try {
    const m = await StudyMaterial.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
    if (!m) return res.status(404).json({ message: "Not found" });
    res.json(m);
  } catch (err) { next(err); }
};

const deleteStudyMaterial = async (req, res, next) => {
  try {
    const m = await StudyMaterial.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    if (!m) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

module.exports = { listStudyMaterials, getStudyMaterialById, createStudyMaterial, updateStudyMaterial, deleteStudyMaterial };
