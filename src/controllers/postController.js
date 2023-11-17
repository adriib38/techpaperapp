const Post = require("../models/Post");

require("dotenv").config();

const verifyPost = require("./middleware/verifyPost");

// Get all posts
const getAllPosts = async (req, res, next) => {
  Post.getAllPosts((err, results) => {
    if (err) {
      res.status(500).json({ message: "Error getting posts", error: err });
    } else {
      res.status(200).json(results);
    }
  });
};

const getPostById = async (req, res, next) => {
  Post.getPostById(req.params.id, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting post", error: err });
    }

    // If return is empty, post was not found
    if (!results) {
      return res.status(404).json({ message: "Post not found" });
    }

    //If the post was found, return it
    res.status(200).json({ message: "Post found", post: results });
  });
};

const createPost = async (req, res, next) => {
  const { title, content, categories } = req.body;
  const author = req.uuid;
  const post = new Post({ title, content, author, categories });

  // Verify the post
  const verificationResult = verifyPost(post);
  if(verificationResult.error) {
    return res.status(400).json({ "created": false, "message": verificationResult.message });
  }

  Post.createPost(post, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error creating post");
    } else {
      res.status(200).json({ message: "Post created" });
    }
  });
};

const getPostsByUsername = async (req, res, next) => {
  Post.getPostsByUsername(req.params.username, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting posts", error: err });
    }

    res
      .status(200)
      .json({
        message: "Posts found",
        username: req.params.username,
        posts: results,
      });
  });
};

const getPostsByCategory = async (req, res, next) => {
  req.params.category = req.params.category.split(" ")[0];
  Post.getPostsByCategory(req.params.category, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting posts", error: err });
    }

    res
      .status(200)
      .json({
        message: "Posts found",
        category: req.params.category,
        posts: results,
      });
  });
};

const deletePostById = async (req, res, next) => {
  try {
    // Check if the post author is the same as the user
    const authorUuid = req.uuid;

    Post.getPostById(req.params.id, (err, results) => {
      if (err) {
        // Send the error if there was one
        return res
          .status(500)
          .json({ message: "Error getting post", error: err });
      }

      // If return is empty, post was not found
      if (!results) {
        return res.status(404).json({ message: "Post not found" });
      }

      // If the post was found, check if the author is the same as the user
      if (results.author_id !== authorUuid) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this post" });
      } else {
        // If the author is the same as the user, delete the post
        Post.deletePostById(req.params.id, (err, results) => {
          if (err) {
            // Send the error if there was one
            return res
              .status(500)
              .json({ message: "Error deleting post", error: err });
          }

          // If return is empty, post was not found
          if (!results) {
            return res.status(404).json({ message: "Post not found" });
          }

          // If the post was found, return it
          res.status(200).json({ message: "Post deleted" });
        });
      }
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getWallPosts = async (req, res, next) => {
  Post.getWallPosts(req.uuid, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting wall posts", error: err });
    }

    res.status(200).json({ message: "Wall posts found", num_posts: results.length, posts: results });
  });
}

module.exports = {
  getAllPosts,
  createPost,
  getPostsByUsername,
  getPostById,
  deletePostById,
  getPostsByCategory,
  getWallPosts
};
