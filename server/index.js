const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDatabase } = require("./connection");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const llmRoutes = require("./routes/llmRoutes");
const authRoutes = require("./routes/authRoutes");
const passport = require("passport");
require("./services/googleAuth"); // Initialize Google OAuth strategy

const PORT = process.env.PORT;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Initialize Passport middleware
app.use(passport.initialize());

connectDatabase(MONGO_CONNECTION_STRING).then(() => {
  console.log("MongoDB Connected");
});

app.use("/user", userRoutes);
app.use("/chat", llmRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
