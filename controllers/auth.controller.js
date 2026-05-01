const User = require("../models/user.model");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");


exports.register = asyncHandler(async (req, res, next) => {
  console.log("done");
  
  const user = await User.create(req.body);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();
  res.status(201).json({
    message: "user created sucessfully",
    user,
    accessToken,
    refreshToken,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparedPassword(password))) {
    return next(new AppError("invalid credintial", 401));
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  user.refreshToken = refreshToken;
  user.accessToken = accessToken;
  await user.save();

  res.status(200).json({
    message: "Logged in successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic
    },
  });
  // res.status(200).json({
  //   message: "Login successful",
  //   user,
  //   accessToken,
  //   refreshToken,
  // });
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  console.log("refreshToken");
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      message: "token expired"
    });
  }
  const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRSH);

  const user = await User.findById(decodedToken.id);

  if (!user || user.refreshToken !== refreshToken) {
    return next(new AppError("invalid refresh token", 401));
  }

  const newAccessToken = user.generateAccessToken();

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.json({ message: "Token refreshed" });
});

exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out" });
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  console.log(user);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePic: user.profilePic
  });
};