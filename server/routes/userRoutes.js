const express = require("express");
const { createNewUser, loginUser } = require("../controller/user");
const { checkForAuth } = require("../middleware/auth");
const router = express.Router();

// Public routes (no authentication required)
router.post("/signup", createNewUser);
router.post("/login", loginUser);

// Protected routes (authentication required)
// Add any protected user routes here with checkForAuth middleware

module.exports = router;
