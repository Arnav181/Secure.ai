const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  googleAuth,
  googleAuthCallback,
  googleAuthSuccess,
  oauthLogout,
} = require("../controller/authController");

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback, googleAuthSuccess);

// Logout route
router.post("/logout", oauthLogout);

module.exports = router;
