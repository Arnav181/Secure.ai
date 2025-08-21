const { setUser } = require("../services/auth");
const user = require("../model/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const createNewUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ msg: "User already exits with this email" });
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userdetails = await user.create({
      username,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ msg: "User created successfully", createdUser: userdetails });
  } catch (err) {
    console.log("Error in creating new user", err);
    res
      .status(500)
      .json({ message: "Failed to create user", error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Incorrect email or password" });
    }
    const token = setUser(existingUser);
    res.cookie("token", token);
    return res.status(201).json({ msg: "Successfully logged in" });
  } catch (err) {
    console.log("Error in logging in user", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ msg: "Cookie cleared successfully" });
};

module.exports = {
  createNewUser,
  loginUser,
};
