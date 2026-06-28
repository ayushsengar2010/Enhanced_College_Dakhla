const express = require("express");
const {
  listCollegeApis,
  createCollegeApi,
  updateCollegeApi,
  deleteCollegeApi
} = require("../controllers/collegeApiController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, listCollegeApis);
router.post("/", requireAuth, createCollegeApi);
router.put("/:id", requireAuth, updateCollegeApi);
router.delete("/:id", requireAuth, deleteCollegeApi);

module.exports = router;
