const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema(
  {
    examName:                   { type: String, required: true },
    slug:                       { type: String },
    shortName:                  { type: String },
    stream:                     { type: String, default: "Engineering" },
    conductingBody:             { type: String },
    examLevel:                  { type: String, default: "National" },
    examMode:                   { type: String, default: "Online" },
    participatingCollegesCount: { type: Number, default: 10 },
    description:                { type: String },
    eligibility:                { type: String },
    syllabus:                   { type: String },
    examPattern:                { type: String },
    applicationStart:           { type: Date },
    applicationEnd:             { type: Date },
    examDate:                   { type: Date },
    resultDate:                 { type: Date },
    officialWebsite:            { type: String },
    applicationLink:            { type: String },
    applicationFee:             { type: Number },
    status:                     { type: String, enum: ["Active", "Inactive", "Upcoming", "Ongoing", "Completed"], default: "Active" },
    isDeleted:                  { type: Boolean, default: false },
  },
  { timestamps: true }
);

ExamSchema.index({ stream: 1, status: 1 });

module.exports = mongoose.model("Exam", ExamSchema);
