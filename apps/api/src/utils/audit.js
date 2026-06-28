const AuditLog = require("../models/AuditLog");

const logAudit = async ({ action, entityType, entityId, message, createdBy }) => {
  try {
    await AuditLog.create({ action, entityType, entityId, message, createdBy });
  } catch (err) {
    console.error("Audit log failed", err.message);
  }
};

module.exports = { logAudit };
