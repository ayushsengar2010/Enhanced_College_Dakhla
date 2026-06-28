const express = require("express");
const { listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require("../controllers/testimonialController");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/",       optionalAuth, listTestimonials);
router.post("/",      requireAuth,  createTestimonial);
router.put("/:id",    requireAuth,  updateTestimonial);
router.delete("/:id", requireAuth,  deleteTestimonial);

module.exports = router;
