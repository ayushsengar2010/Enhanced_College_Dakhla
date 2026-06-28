const Testimonial = require("../models/Testimonial");
const { parsePagination } = require("../utils/pagination");

const listTestimonials = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };
    if (!req.user) filter.isVerified = true;
    const [items, total] = await Promise.all([
      Testimonial.find(filter).sort({ isFeatured: -1, createdAt: -1 }).skip(skip).limit(limit),
      Testimonial.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const createTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.create(req.body);
    res.status(201).json(t);
  } catch (err) { next(err); }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
    if (!t) return res.status(404).json({ message: "Not found" });
    res.json(t);
  } catch (err) { next(err); }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    if (!t) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

module.exports = { listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
