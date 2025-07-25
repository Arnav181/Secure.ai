const express = require("express");
const { createNewUser, loginUser } = require("../controller/user");
const { checkForAuth } = require("../middleware/auth");
const router = express.Router();

router.use(checkForAuth);
router.post("/signup", createNewUser);
router.post("/login", loginUser);

module.exports = router;
