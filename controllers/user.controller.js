const User = require("../models/user.model");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");

exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    console.log(user);

    res.status(201).json({
        success: true,
        user,
    });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
    console.log(req.query);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 0;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);

    const total = await User.countDocuments();
    console.log(users);

    if (users.length <= 0) {
        return next(AppError("no users found", 404));
    }
    res.status(200).json({
        success: true,
        total,
        page,
        data: users,
    });
});

exports.getUserStats = asyncHandler(async (req, res, next) => {
    const result = await User.aggregate([
        { $match: { age: { $gte: 18 } } }, //3
        {
            $group: {
                _id: null,
                avgAge: { $avg: "$age" },
                totalUsers: { sum: 1 },
            },
        },
    ]);

    res.status(200).json({
        success: true,
        data: result,
    });
});



