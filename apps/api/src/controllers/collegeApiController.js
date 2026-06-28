const CollegeApi = require("../models/CollegeApi");
const { parsePagination } = require("../utils/pagination");

const listCollegeApis = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [items, total] = await Promise.all([
      CollegeApi.find(filter)
        .populate("collegeId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CollegeApi.countDocuments(filter)
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

const createCollegeApi = async (req, res, next) => {
  try {
    const collegeApi = await CollegeApi.create(req.body);
    res.status(201).json(collegeApi);
  } catch (err) {
    next(err);
  }
};

const updateCollegeApi = async (req, res, next) => {
  try {
    const collegeApi = await CollegeApi.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!collegeApi) {
      return res.status(404).json({ message: "API mapping not found" });
    }
    res.json(collegeApi);
  } catch (err) {
    next(err);
  }
};

const deleteCollegeApi = async (req, res, next) => {
  try {
    const collegeApi = await CollegeApi.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!collegeApi) {
      return res.status(404).json({ message: "API mapping not found" });
    }
    res.json({ message: "API mapping deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { listCollegeApis, createCollegeApi, updateCollegeApi, deleteCollegeApi };
