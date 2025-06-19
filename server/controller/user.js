const user = require("../model/user");

const createNewUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userdetails = await user.create({ username, email, password });
    console.log(userdetails);
  } catch (err) {
    console.log("Error in creating new user", err);
  }
};

module.exports = {
  createNewUser,
};
