const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    collegeId:   { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    collegeName: { type: String, default: "IIT BHU Varanasi - Indian Institute of Technology" },
    studentName: { type: String, required: true },
    email:       { type: String },
    batch:       { type: String },
    course:      { type: String },
    ratings: {
      overall:    { type: Number, min: 1, max: 5, default: 5 },
      placement:  { type: Number, min: 1, max: 5 },
      faculty:    { type: Number, min: 1, max: 5 },
      campus:     { type: Number, min: 1, max: 5 },
      value:      { type: Number, min: 1, max: 5 },
    },
    rating:      { type: Number, default: 5 },
    title:       { type: String },
    body:        { type: String, default: "Good Campus" },
    message:     { type: String, default: "Good Campus" },
    pros:        { type: String },
    cons:        { type: String },
    isVerified:  { type: Boolean, default: false },
    status:      { type: String, enum: ["Active", "Inactive", "Pending", "Approved", "Rejected"], default: "Inactive" },
    isDeleted:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Review", ReviewSchema);
