const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profilePic : {
        type : String,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparedPassword = function (pass) {
    return bcrypt.compare(pass, this.password);
};

// access token vs refresh token

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_REFRSH, {
        expiresIn: "7d",
    });
};

module.exports = mongoose.model("User", userSchema);
