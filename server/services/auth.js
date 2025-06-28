require("dotenv");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const setUser = (user) => {
  return jwt.sign(
    {
      _id: user.id,
      email: user.email,
    },
    secretKey,
    { expiresIn: "1h" }
  );
};

module.exports = {
  setUser,
};
