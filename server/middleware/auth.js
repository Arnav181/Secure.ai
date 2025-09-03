const { getUser } = require("../services/auth");

const checkForAuth = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ msg: "No cookie found" });
  }
  try {
    const user = getUser(token);
    if (!user) {
      return res.status(401).json({ msg: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log("Error in validating user", err);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = { checkForAuth };
