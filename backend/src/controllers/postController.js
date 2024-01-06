const Post = require("../models/Post");
const { promisify } = require("util");

require("dotenv").config();

const verifyPost = require("./middleware/verifyPost");

// Get all posts
const getAllPosts = async (req, res, next) => {
  Post.getAllPosts(req.uuid, (err, results) => {
    if (err) {
      res.status(500).json({ message: "Error getting posts", error: err });
    } else {
      res.status(200).json(results);
    }
  });
};

const getPostById = async (req, res, next) => {
  Post.getPostById(req.params.id, req.uuid, (err, results) => {
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
  const post = new Post({
    title,
    content,
    author,
    categories,
    created_at: new Date().toISOString(),
  });

  // Verify the post
  const verificationResult = verifyPost(post);
  if (verificationResult.error) {
    return res
      .status(400)
      .json({ created: false, message: verificationResult.message });
  }

  Post.createPost(post, (err, results, postId) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error creating post");
    } else {
      res.status(200).json({ message: "Post created", post_id: postId });
    }
  });
};

const getPostsByUsername = async (req, res, next) => {
  Post.getPostsByUsername(req.params.username, req.uuid, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting posts", error: err });
    }

    res.status(200).json({
      message: "Posts found",
      username: req.params.username,
      posts: results,
    });
  });
};

const getPostsByCategory = async (req, res, next) => {
  req.params.category = req.params.category.split(" ")[0];
  Post.getPostsByCategory(req.params.category, req.uuid, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting posts", error: err });
    }

    res.status(200).json({
      message: "Posts found",
      category: req.params.category,
      posts: results,
    });
  });
};

const deletePostById = async (req, res, next) => {
  try {
    const authorUuid = req.uuid;
    const postId = req.params.id;

    //Verify if post exist
    const post = await new Promise((resolve, reject) => {
      Post.getPostById(postId, authorUuid, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //Verify if post author is the user
    if(post.author_uuid != authorUuid){
      return res.status(401).json({ message: "You are not authorized to delete this post" });
    }

    //Delete post
    Post.deletePostById(req.params.id, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error deleting post", details: err.message });
      }

      if (!result) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.status(200).json({ message: "Post deleted" });
    });
  } catch (error) {
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

    res
      .status(200)
      .json({
        message: "Wall posts found",
        num_posts: results.length,
        posts: results,
      });
  });
};

const searchPosts = async (req, res, next) => {
  Post.getSearchPost(req.params.search, req.uuid, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting posts", error: err });
    }

    if (results.length === 0) {
      res.status(404).json({ message: "No posts found" });
    }

    if (results.length > 0) {
      res
        .status(200)
        .json({
          message: "Posts found",
          n_posts: results.length,
          posts: results,
        });
    }
  });
};

module.exports = {
  getAllPosts,
  createPost,
  getPostsByUsername,
  getPostById,
  deletePostById,
  getPostsByCategory,
  getWallPosts,
  searchPosts,
};
