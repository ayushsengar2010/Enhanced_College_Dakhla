const mongoose = require("mongoose");

const SubstreamSchema = new mongoose.Schema(
  {
    streamName:    { type: String, required: true },
    substreamName: { type: String, required: true },
    status:        { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isDeleted:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

SubstreamSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Substream", SubstreamSchema);
