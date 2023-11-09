const express = require("express");
const postController = require("../../controllers/postController");

const verifyToken = require("../../controllers/middleware/verifyToken");

const router = express.Router();

router
    .get("/", postController.getAllPosts)
    .get("/user/:username", verifyToken, postController.getPostsByUsername)
    .get("/:id", verifyToken, postController.getPostById)
    .get("/category/:category", verifyToken, postController.getPostsByCategory)
    .post("/", verifyToken, postController.createPost)
    .delete("/:id", verifyToken, postController.deletePostById);

module.exports = router;
