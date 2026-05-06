require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const authRoutes = require("./routes/auth.route");

const app = express();

app.use(cookieParser());

app.use(cors({
    origin: "https://bog-post.vercel.app",
    credentials: true,
}));

app.use(express.json());

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.error(err));

module.exports = app;