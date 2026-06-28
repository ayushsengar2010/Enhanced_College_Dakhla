const express = require("express");
const {
  listStreams, createStream, updateStream, deleteStream,
  listSubstreams, createSubstream, updateSubstream, deleteSubstream,
  listCourseDurations, createCourseDuration, updateCourseDuration, deleteCourseDuration,
} = require("../controllers/mastersController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Streams
router.get("/streams", listStreams);
router.post("/streams", requireAuth, createStream);
router.put("/streams/:id", requireAuth, updateStream);
router.delete("/streams/:id", requireAuth, deleteStream);

// Substreams
router.get("/substreams", listSubstreams);
router.post("/substreams", requireAuth, createSubstream);
router.put("/substreams/:id", requireAuth, updateSubstream);
router.delete("/substreams/:id", requireAuth, deleteSubstream);

// Durations
router.get("/durations", listCourseDurations);
router.post("/durations", requireAuth, createCourseDuration);
router.put("/durations/:id", requireAuth, updateCourseDuration);
router.delete("/durations/:id", requireAuth, deleteCourseDuration);

module.exports = router;
