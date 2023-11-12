const express = require("express");
const postController = require("../../controllers/postController");

const verifyToken = require("../../controllers/middleware/verifyToken");

const router = express.Router();

router
    .get("/", postController.getAllPosts)
    .get("/user/:username", verifyToken, postController.getPostsByUsername)
    .get("/posts/:id", verifyToken, postController.getPostById)
    .get("/category/:category", verifyToken, postController.getPostsByCategory)
    .post("/", verifyToken, postController.createPost)
    .delete("/posts/:id", verifyToken, postController.deletePostById)
    .get("/wall", verifyToken, postController.getWallPosts)

    
module.exports = router;
