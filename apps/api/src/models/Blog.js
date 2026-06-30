const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true },
    slug:          { type: String, index: true },
    category:      { type: String, default: "Exam Alerts", index: true },
    blogCategory:  { type: String, default: "Exam Alerts" },
    content:       { type: String },
    blogDescription: { type: String },
    excerpt:       { type: String },
    coverImage:    { type: String },
    featuredImage: { type: String },
    readTime:      { type: String, default: "3 Min Read" },
    author:        { type: String, default: "College Dakhla Team" },
    authorName:    { type: String, default: "College Dakhla Team" },
    tags:          { type: [String], default: [] },
    publishDate:   { type: Date, default: Date.now },

    /* ── Featured Posts ─────────────────────────────────────── */
    isFeatured:    { type: Boolean, default: false, index: true },
    featuredOrder: { type: Number, default: 0 },

    /* ── SEO Meta Fields ────────────────────────────────────── */
    metaTitle:       { type: String },
    metaDescription: { type: String },
    metaKeywords:    { type: String },
    canonicalUrl:    { type: String },
    ogImage:         { type: String },
    ogTitle:         { type: String },
    ogDescription:   { type: String },

    status:    { type: String, enum: ["Active", "Inactive", "Published", "Draft"], default: "Published" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ── Pre-save hooks to sync duplicate fields ─────────────── */
BlogSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  // Sync category <-> blogCategory
  if (this.category && !this.blogCategory) {
    this.blogCategory = this.category;
  } else if (this.blogCategory && !this.category) {
    this.category = this.blogCategory;
  }
  // Sync coverImage <-> featuredImage
  if (this.coverImage && !this.featuredImage) {
    this.featuredImage = this.coverImage;
  } else if (this.featuredImage && !this.coverImage) {
    this.coverImage = this.featuredImage;
  }
  // Sync author <-> authorName
  if (this.author && !this.authorName) {
    this.authorName = this.author;
  } else if (this.authorName && !this.author) {
    this.author = this.authorName;
  }
  // Sync blogDescription -> excerpt if only blogDescription is provided
  if (this.blogDescription && !this.excerpt) {
    this.excerpt = this.blogDescription.replace(/<[^>]*>/g, "").substring(0, 200);
  }
  next();
});

/* ── Indexes ─────────────────────────────────────────────── */
BlogSchema.index({ status: 1, createdAt: -1 });
BlogSchema.index({ isFeatured: 1, featuredOrder: 1, createdAt: -1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model("Blog", BlogSchema);
