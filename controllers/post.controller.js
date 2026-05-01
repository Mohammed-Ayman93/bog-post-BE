const Post = require("../models/post.model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");


exports.createPost = asyncHandler(async (req, res, next) => {
    
    try {
        const { title, description, image, author } = req.body;

        const post = await Post.create({
            title,
            description,
            image,
            author: req.user.id

        });
        res.status(201).json(post);
    } catch (err) {
        throw new AppError(` ${err.message}`, 500);
    }
});

exports.getPosts = asyncHandler(async (req, res, next) => {
    try {
        const { title, author, image } = req.query;
        const posts = await Post.find().populate("author", ["name", "profilePic"]).sort({createdAt : -1});
        res.status(200).json(posts);
    } catch (err) {
        throw new AppError(` ${err.message}`, 500);
    }
});

exports.delPost = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const posts = await Post.deleteOne({ _id: id });
        console.log(posts);

        res.status(200).json(posts);
    } catch (err) {
        throw new AppError(` ${err.message}`, 500);

    }
})

exports.editePost = asyncHandler(async (req, res, next) => {
    try {
        // const { id } = req.params;
        console.log(req.body._id);
        const updatedPost = {
            $set: {
                title: req.body.title,
                description: req.body.description,
                image: req.body.image,
                updatedAt : new Date()
            }
        }

        const result = await Post.updateOne({ _id: req.body._id }, updatedPost);
        console.log(result);

        if (result.matchedCount === 0) {
            return res.status(404).send('No document matched the filter.');
        }
        res.send(`Successfully updated ${result.modifiedCount} document(s).`);
    } catch (err) {
        throw new AppError(` ${err.message}`, 500);

    }
})