const express = require("express");
const { listStudyMaterials, getStudyMaterialById, createStudyMaterial, updateStudyMaterial, deleteStudyMaterial } = require("../controllers/studyMaterialController");
const { requireAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/",       listStudyMaterials);
router.get("/:id",    getStudyMaterialById);
router.post("/",      requireAuth, createStudyMaterial);
router.put("/:id",    requireAuth, updateStudyMaterial);
router.delete("/:id", requireAuth, deleteStudyMaterial);

module.exports = router;
