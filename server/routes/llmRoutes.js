const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  analyzeZip,
  chatMessage,
  chatBotMessage,
} = require("../controller/llm");

const upload = multer({ storage: multer.memoryStorage() });
router.post("/codebase", upload.single("zipfile"), analyzeZip);
router.post("/message", chatMessage);
router.post("/chatbot", chatBotMessage);

module.exports = router;
