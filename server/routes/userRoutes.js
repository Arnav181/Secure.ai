const express = require("express");
const {
  createNewUser,
  loginUser,
  logoutUser,
  sendUserInfo,
} = require("../controller/user");
const { checkForAuth } = require("../middleware/auth");
const router = express.Router();

router.use(checkForAuth);
router.post("/signup", createNewUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/userdetails", sendUserInfo);

module.exports = router;
