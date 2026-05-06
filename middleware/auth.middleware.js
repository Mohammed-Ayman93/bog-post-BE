const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");

exports.protect = asyncHandler(async (req, res, next) => {  
  try {
    console.log("req.cookies");
    const token = req.cookies.accessToken;

    if (!token) {
      return next(new AppError("user is not loggedin", 401));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return next(new AppError("user not found", 401));
    }

    req.user = user;

    next();
  } catch (err) {
    return next(new AppError("token expired", 401));

  }
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("not Allowed", 403));
    }
    next();
  };
};
