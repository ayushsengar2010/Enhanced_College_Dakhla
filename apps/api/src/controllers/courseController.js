const Course = require("../models/Course");
const { parsePagination } = require("../utils/pagination");

const listCourses = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };
    if (req.query.search) {
      filter.courseName = new RegExp(req.query.search, "i");
    }

    const [items, total] = await Promise.all([
      Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Course.countDocuments(filter)
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { listCourses, createCourse, updateCourse, deleteCourse };
