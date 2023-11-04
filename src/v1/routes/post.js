const express = require("express");
const postController = require("../../controllers/postController");

const verifyToken = require("../../controllers/middleware/verifyToken");

const router = express.Router();

router
    .get("/all", postController.getAllPosts)
    .post("/create", verifyToken, postController.createPost)
    .get("/user/:username", verifyToken, postController.getPostsByUsername);

module.exports = router;
