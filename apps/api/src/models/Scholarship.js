const mongoose = require("mongoose");

const ScholarshipSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    provider:      { type: String, required: true },
    type:          { type: String, enum: ["Merit","Need-based","Sports","Minority","State","Central","Olympiad","Other"], default: "Merit" },
    stream:        [String],
    amount:        { type: String },
    description:   { type: String },
    eligibility:   { type: String },
    howToApply:    { type: String },
    lastDate:      { type: Date },
    officialLink:  { type: String },
    isActive:      { type: Boolean, default: true },
    isDeleted:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

ScholarshipSchema.index({ isActive: 1 });

module.exports = mongoose.model("Scholarship", ScholarshipSchema);
