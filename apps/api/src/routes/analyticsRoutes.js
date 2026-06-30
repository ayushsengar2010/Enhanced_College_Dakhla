const express = require("express");
const { getDashboardStats, exportAnalyticsCSV } = require("../controllers/analyticsController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", requireAuth, getDashboardStats);
router.get("/export/csv", requireAuth, exportAnalyticsCSV);

module.exports = router;
