const express = require("express");
const { predictColleges } = require("../controllers/predictorController");

const router = express.Router();

router.post("/predict", predictColleges);

module.exports = router;
