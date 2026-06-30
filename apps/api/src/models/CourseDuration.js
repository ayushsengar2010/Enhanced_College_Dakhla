const mongoose = require("mongoose");

const CourseDurationSchema = new mongoose.Schema(
  {
    duration:  { type: String, required: true },
    status:    { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CourseDurationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("CourseDuration", CourseDurationSchema);
