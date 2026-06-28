const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    body:        { type: String, required: true },
    authorName:  { type: String, default: "Anonymous" },
    authorEmail: { type: String },
    isExpert:    { type: Boolean, default: false },
    upvotes:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

const QuestionSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    body:        { type: String },
    authorName:  { type: String, required: true },
    authorEmail: { type: String },
    stream:      { type: String, enum: ["Engineering","Management","Medical","Commerce","Arts","Law","General","Other"], default: "General" },
    tags:        [String],
    answers:     [AnswerSchema],
    views:       { type: Number, default: 0 },
    upvotes:     { type: Number, default: 0 },
    status:      { type: String, enum: ["Open","Closed"], default: "Open" },
    isDeleted:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

QuestionSchema.index({ stream: 1, createdAt: -1 });

module.exports = mongoose.model("Question", QuestionSchema);
