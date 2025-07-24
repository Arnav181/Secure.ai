const express = require("express");
const router = express.Router();
const multer = require("multer");
const { analyzeZip, chatMessage } = require("../controller/llm");

const upload = multer({ storage: multer.memoryStorage() });
router.post("/codebase", upload.single("zipfile"), analyzeZip);
router.post("/message", chatMessage);

module.exports = router;
