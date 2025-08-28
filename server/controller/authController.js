const passport = require("passport");
const User = require("../model/user");
const { setUser } = require("../services/auth");

// Initiate Google OAuth authentication
const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Handle Google OAuth callback
const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/login",
  session: false, // We're using JWT, not sessions
});

// Success handler for Google OAuth
const googleAuthSuccess = async (req, res) => {
  try {
    // Generate JWT token
    const token = setUser(req.user);
    
    // Set token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });
    
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
  } catch (error) {
    console.error("Error in Google OAuth success handler:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Handle OAuth logout
const oauthLogout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "Logged out successfully" });
};

module.exports = {
  googleAuth,
  googleAuthCallback,
  googleAuthSuccess,
  oauthLogout,
};
