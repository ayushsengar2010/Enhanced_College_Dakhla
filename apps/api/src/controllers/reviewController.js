const Review = require("../models/Review");
const College = require("../models/College");
const { parsePagination } = require("../utils/pagination");

const listReviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };
    if (req.query.collegeId) filter.collegeId = req.query.collegeId;
    if (req.query.status) filter.status = req.query.status;
    
    const [items, total] = await Promise.all([
      Review.find(filter).populate("collegeId", "collegeName slug").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Review.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) { next(err); }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (req.body.status === "Approved" || req.body.status === "Active") {
      const approved = await Review.find({ collegeId: review.collegeId, isDeleted: false });
      if (approved.length) {
        const avg = approved.reduce((s, r) => s + (r.ratings?.overall || r.rating || 5), 0) / approved.length;
        await College.findByIdAndUpdate(review.collegeId, { rating: Math.round(avg * 10) / 10 });
      }
    }
    res.json(review);
  } catch (err) { next(err); }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { new: true });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

module.exports = { listReviews, createReview, updateReview, deleteReview };
