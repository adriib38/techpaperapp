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

}

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
}

const getPostsByUsername = async (req, res, next) => {

  Post.getPostsByUsername(req.params.username, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting user", error: err });
    }

    res.status(200).json({ message: "Posts found", posts: results });
  });
}


module.exports = {
  getAllPosts,
  createPost,
  getPostsByUsername
};
