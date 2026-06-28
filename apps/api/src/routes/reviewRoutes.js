const express = require("express");
const { listReviews, createReview, updateReview, deleteReview } = require("../controllers/reviewController");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/",       optionalAuth, listReviews);
router.post("/",      createReview);        // public — student submits review
router.put("/:id",    requireAuth, updateReview);  // admin approves/rejects
router.delete("/:id", requireAuth, deleteReview);

module.exports = router;
