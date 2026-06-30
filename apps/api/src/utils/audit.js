const AuditLog = require("../models/AuditLog");
const logger = require("./logger");
const path = require("path");
const fs = require("fs");

// Configurable fallback path for audit logs when MongoDB is unavailable
const FALLBACK_PATH = process.env.AUDIT_FALLBACK_PATH || path.join(__dirname, "../../audit-fallback.log");

const logAudit = async ({ action, entityType, entityId, message, createdBy }) => {
  try {
    await AuditLog.create({ action, entityType, entityId, message, createdBy });
    logger.debug("Audit log entry created", { action, entityType, entityId: entityId?.toString() });
  } catch (err) {
    // Log to file/system instead of silently failing
    logger.error("Audit log failed — writing to fallback file", {
      error: err.message,
      action,
      entityType,
    });
    
    // Write to fallback file when MongoDB is down
    try {
      const entry = JSON.stringify({
        timestamp: new Date().toISOString(),
        action,
        entityType,
        entityId: entityId?.toString(),
        message,
        createdBy,
        error: err.message,
      }) + "\n";
      
      // Ensure directory exists
      const dir = path.dirname(FALLBACK_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.appendFileSync(FALLBACK_PATH, entry);
    } catch (fallbackErr) {
      logger.error("Audit fallback file write also failed", { error: fallbackErr.message });
    }
  }
};

module.exports = { logAudit };
