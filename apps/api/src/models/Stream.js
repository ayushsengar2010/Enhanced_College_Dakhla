const mongoose = require("mongoose");

const StreamSchema = new mongoose.Schema(
  {
    streamName: { type: String, required: true },
    status:     { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isDeleted:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stream", StreamSchema);
