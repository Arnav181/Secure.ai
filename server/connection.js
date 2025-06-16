const mongoose = require("mongoose");

const connectDatabase = async (url) => {
  try {
    return await mongoose.connect(url);
  } catch (err) {
    console.log("Error in connecting DB:", err);
  }
};

module.exports = {
  connectDatabase,
};
