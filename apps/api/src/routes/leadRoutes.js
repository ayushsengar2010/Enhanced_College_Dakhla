const express = require("express");
const {
  createLead,
  listLeads,
  getLeadById,
  updateLead,
  deleteLead,
  sendLeadEmail,
  exportLeadsCSV,
} = require("../controllers/leadController");
const { leadLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/", leadLimiter, createLead);
router.get("/", listLeads);
router.get("/export/csv", exportLeadsCSV);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.post("/:id/email", sendLeadEmail);

module.exports = router;
