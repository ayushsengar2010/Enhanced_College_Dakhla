const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    courseName:   { type: String, required: true },
    stream:       { type: String, default: "Engineering" },
    subStream:    { type: String, default: "General" },
    courseType:   { type: String, default: "Bachelors" },
    duration:     { type: String, default: "3 Years" },
    entranceExam: { type: String, default: "University Entrance Exam" },
    description:  { type: String },
    fees:         { type: Number },
    feeAmount:    { type: String },
    feeRange:     { type: String },
    eligibility:  { type: String },
    courseReview: { type: String, default: "4.5/5" },
    courseLevel:  { type: String, default: "UG" },
    status:       { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isDeleted:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

CourseSchema.index({ stream: 1, status: 1 });

module.exports = mongoose.model("Course", CourseSchema);
