const Post = require("../models/Post");

require("dotenv").config();

// Get all posts
const getAllPosts = async (req, res, next) => {

  Post.getAllPosts((err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving posts from database");
    } else {
      res.status(200).json(results);
    }
  });

}

module.exports = {
  getAllPosts,
};
