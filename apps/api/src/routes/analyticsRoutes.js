const express = require("express");
const { getDashboardStats } = require("../controllers/analyticsController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", requireAuth, getDashboardStats);

module.exports = router;
