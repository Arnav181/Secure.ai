const express = require("express");
const { connectDatabase } = require("./connection");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const PORT = process.env.PORT;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const app = express();

app.use(express.json());

connectDatabase(MONGO_CONNECTION_STRING).then(() => {
  console.log("MongoDB Connected");
});

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
