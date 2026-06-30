const Stream = require("../models/Stream");
const Substream = require("../models/Substream");
const CourseDuration = require("../models/CourseDuration");
const { parsePagination } = require("../utils/pagination");
const { safeRegex } = require("../utils/validation");

// Streams
const listStreams = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };
    if (req.query.search) filter.streamName = safeRegex(req.query.search);
    const [items, total] = await Promise.all([
      Stream.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Stream.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const createStream = async (req, res, next) => {
  try {
    const stream = await Stream.create(req.body);
    res.status(201).json(stream);
  } catch (err) { next(err); }
};

const updateStream = async (req, res, next) => {
  try {
    const stream = await Stream.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stream) {
      return res.status(404).json({ message: "Stream not found" });
    }
    res.json(stream);
  } catch (err) { next(err); }
};

const deleteStream = async (req, res, next) => {
  try {
    await Stream.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

// Substreams
const listSubstreams = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };
    if (req.query.search) filter.substreamName = safeRegex(req.query.search);
    const [items, total] = await Promise.all([
      Substream.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Substream.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const createSubstream = async (req, res, next) => {
  try {
    const substream = await Substream.create(req.body);
    res.status(201).json(substream);
  } catch (err) { next(err); }
};

const updateSubstream = async (req, res, next) => {
  try {
    const substream = await Substream.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!substream) {
      return res.status(404).json({ message: "Substream not found" });
    }
    res.json(substream);
  } catch (err) { next(err); }
};

const deleteSubstream = async (req, res, next) => {
  try {
    const substream = await Substream.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!substream) {
      return res.status(404).json({ message: "Substream not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

// Course Durations
const listCourseDurations = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };
    if (req.query.search) filter.duration = safeRegex(req.query.search);
    const [items, total] = await Promise.all([
      CourseDuration.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      CourseDuration.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const createCourseDuration = async (req, res, next) => {
  try {
    const duration = await CourseDuration.create(req.body);
    res.status(201).json(duration);
  } catch (err) { next(err); }
};

const updateCourseDuration = async (req, res, next) => {
  try {
    const duration = await CourseDuration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!duration) {
      return res.status(404).json({ message: "Course duration not found" });
    }
    res.json(duration);
  } catch (err) { next(err); }
};

const deleteCourseDuration = async (req, res, next) => {
  try {
    const duration = await CourseDuration.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!duration) {
      return res.status(404).json({ message: "Course duration not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

module.exports = {
  listStreams, createStream, updateStream, deleteStream,
  listSubstreams, createSubstream, updateSubstream, deleteSubstream,
  listCourseDurations, createCourseDuration, updateCourseDuration, deleteCourseDuration,
};
