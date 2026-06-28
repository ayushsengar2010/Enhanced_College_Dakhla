const mongoose = require("mongoose");

// Email subscriber for admission alerts
const AlertSubscriberSchema = new mongoose.Schema(
  {
    email:       { type: String, required: true, unique: true },
    name:        { type: String },
    streams:     [String],
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Published alert/notification
const AlertSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true },
    body:       { type: String, required: true },
    type:       { type: String, enum: ["Exam","Result","Admission","Deadline","Other"], default: "Other" },
    stream:     [String],
    examName:   { type: String },
    deadline:   { type: Date },
    link:       { type: String },
    isActive:   { type: Boolean, default: true },
    isDeleted:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

AlertSchema.index({ isActive: 1, createdAt: -1 });

const AlertSubscriber = mongoose.model("AlertSubscriber", AlertSubscriberSchema);
const Alert           = mongoose.model("Alert",           AlertSchema);

module.exports = { Alert, AlertSubscriber };
