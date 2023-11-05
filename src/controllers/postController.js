const Post = require("../models/Post");

require("dotenv").config();

// Get all posts
const getAllPosts = async (req, res, next) => {
  Post.getAllPosts((err, results) => {
    if (err) {
      res.status(500).send("Error retrieving posts from database");
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
  const { title, content } = req.body;

  const author = req.uuid;

  const post = new Post({ title, content, author });

  Post.createPost(post, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error creating post");
    } else {
      res.status(200).json(results);
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

    res.status(200).json({ message: "Posts found", posts: results });
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

module.exports = {
  getAllPosts,
  createPost,
  getPostsByUsername,
  getPostById,
  deletePostById,
};
