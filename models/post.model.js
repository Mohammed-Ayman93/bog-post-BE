const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    author:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    ,

},{timestamps : true});

module.exports = mongoose.model("Post", postSchema);