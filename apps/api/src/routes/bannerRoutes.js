const express = require("express");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const { listBanners, createBanner, updateBanner, deleteBanner } = require("../controllers/bannerController");

const router = express.Router();

// Public: get active banners
router.get("/", optionalAuth, listBanners);

// Admin CRUD
router.post("/", requireAuth, createBanner);
router.put("/:id", requireAuth, updateBanner);
router.delete("/:id", requireAuth, deleteBanner);

module.exports = router;
