const express = require("express");
const { connectDatabase } = require("./connection");
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const app = express();

connectDatabase(MONGO_CONNECTION_STRING).then(() => {
  console.log("MongoDB Connected");
});

app.get("/", (req, res) => {
  res.end("Test Route");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
