const express = require("express");
const { listAlerts, createAlert, updateAlert, deleteAlert, subscribe, listSubscribers } = require("../controllers/alertController");
const { requireAuth, optionalAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/",                optionalAuth, listAlerts);
router.post("/",               requireAuth,  createAlert);
router.put("/:id",             requireAuth,  updateAlert);
router.delete("/:id",          requireAuth,  deleteAlert);
router.post("/subscribe",      subscribe);           // public
router.get("/subscribers/all", requireAuth, listSubscribers);

module.exports = router;
