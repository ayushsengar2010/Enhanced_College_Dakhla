const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    name:        { type: String },
    role:        { type: String, default: "Student" },
    college:     { type: String },
    rating:      { type: Number, min: 1, max: 5, default: 5 },
    review:      { type: String },
    description: { type: String },
    avatar:      { type: String },
    status:      { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isVerified:  { type: Boolean, default: true },
    isFeatured:  { type: Boolean, default: true },
    isDeleted:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", TestimonialSchema);
