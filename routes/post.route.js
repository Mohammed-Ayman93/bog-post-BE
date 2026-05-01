const express = require("express");
const router = express.Router();
const { createPost, getPosts, delPost, editePost } = require("../controllers/post.controller");
const { protect } = require("../middleware/auth.middleware");
router.post("/", protect , createPost);
router.get("/", getPosts);
router.delete("/:id" , protect ,delPost);
router.patch("/" , protect ,editePost)
module.exports = router;
