const express = require("express");
const router = express.Router();
const multer = require("multer");
const { analyzeZip } = require("../controller/llm");

const upload = multer({ storage: multer.memoryStorage() });
router.post("/codebase", upload.single("zipfile"), analyzeZip);

module.exports = router;
