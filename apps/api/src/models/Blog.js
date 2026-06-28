const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true },
    slug:          { type: String, index: true },
    category:      { type: String, default: "Exams" },
    content:       { type: String },
    blogDescription: { type: String },
    excerpt:       { type: String },
    coverImage:    { type: String },
    featuredImage: { type: String },
    readTime:      { type: String, default: "3 Min Read" },
    author:        { type: String, default: "College Dakhla Team" },
    authorName:    { type: String, default: "College Dakhla Team" },
    tags:          [String],
    publishDate:   { type: Date, default: Date.now },
    metaTitle:     { type: String },
    metaDescription: { type: String },
    status:        { type: String, enum: ["Active", "Inactive", "Published", "Draft"], default: "Active" },
    isDeleted:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

BlogSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  next();
});

BlogSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Blog", BlogSchema);
