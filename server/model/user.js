const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Not required for OAuth users
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allows null values while maintaining uniqueness
    },
    authProvider: {
      type: String,
      required: true,
      default: "local",
      enum: ["local", "google"],
    },
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);

module.exports = user;
