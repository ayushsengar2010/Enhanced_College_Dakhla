const { Alert, AlertSubscriber } = require("../models/Alert");
const { parsePagination } = require("../utils/pagination");

// ── Alerts ────────────────────────────────────────────────────────
const listAlerts = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { isDeleted: false };
    if (!req.user) filter.isActive = true;
    if (req.query.type)   filter.type   = req.query.type;
    if (req.query.stream) filter.stream = req.query.stream;
    const [items, total] = await Promise.all([
      Alert.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Alert.countDocuments(filter),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

const createAlert = async (req, res, next) => {
  try {
    const a = await Alert.create(req.body);
    res.status(201).json(a);
  } catch (err) { next(err); }
};

const updateAlert = async (req, res, next) => {
  try {
    const a = await Alert.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, req.body, { new: true });
    if (!a) return res.status(404).json({ message: "Not found" });
    res.json(a);
  } catch (err) { next(err); }
};

const deleteAlert = async (req, res, next) => {
  try {
    await Alert.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};

// ── Subscribers ───────────────────────────────────────────────────
const subscribe = async (req, res, next) => {
  try {
    const { email, name, streams } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
    const sub = await AlertSubscriber.findOneAndUpdate(
      { email },
      { email, name, streams, isActive: true },
      { upsert: true, new: true }
    );
    res.status(201).json({ message: "Subscribed successfully", sub });
  } catch (err) { next(err); }
};

const listSubscribers = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [items, total] = await Promise.all([
      AlertSubscriber.find({ isActive: true }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AlertSubscriber.countDocuments({ isActive: true }),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

module.exports = { listAlerts, createAlert, updateAlert, deleteAlert, subscribe, listSubscribers };
