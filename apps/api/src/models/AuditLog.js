const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: mongoose.Schema.Types.ObjectId,
    message: String,
    createdBy: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", AuditLogSchema);
