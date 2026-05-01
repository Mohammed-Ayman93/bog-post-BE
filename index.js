require('dotenv').config()
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const authRoutes = require("./routes/auth.route");
const cookieParser = require('cookie-parser');


const app = express();
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json());
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("DB connected successfully");
        app.listen(process.env.PORT, () => {
            console.log("server is running on port 3000");
        });
    })
    .catch((err) => console.error("DB connection failed", err));