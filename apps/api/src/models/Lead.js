const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    name:             { type: String, required: true },
    email:            { type: String, required: true },
    phone:            { type: String, required: true },
    state:            { type: String },
    city:             { type: String },
    course:           { type: String },
    message:          { type: String },
    source:           { type: String, default: "home_recommendation_portal" },
    collegeId:        { type: mongoose.Schema.Types.ObjectId, ref: "College", default: null },
    assignedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
    status:           { 
      type: String, 
      enum: ["Pending", "Contacted", "Interested", "Not Interested", "Admission Done", "Closed", "New", "Sent", "Failed"],
      default: "Pending" 
    },
    remark:           { type: String, default: "" },
    apiResponse:      mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1 });

module.exports = mongoose.model("Lead", LeadSchema);
