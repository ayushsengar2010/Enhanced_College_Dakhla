const mongoose = require("mongoose");

const CollegeApiSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
    apiUrl: { type: String, required: true },
    method: {
      type: String,
      enum: ["POST", "GET", "PUT", "PATCH"],
      default: "POST"
    },
    apiKey: String,
    apiToken: String,
    leadEndpoint: String,
    status: { type: String, enum: ["Active", "Inactive"], default: "Inactive" },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CollegeApi", CollegeApiSchema);
