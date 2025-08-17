const { getUser } = require("../services/auth");

const checkForAuth = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ msg: "No cookie found" });
  }
  try {
    const user = getUser(token);
    req.user = user;
    next();
  } catch (err) {
    console.log("Error in validating user", err);
  }
};

module.exports = { checkForAuth };
