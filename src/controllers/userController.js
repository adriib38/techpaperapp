const User = require("../models/User");
const Follow = require("../models/Follow");

const jwt = require("jsonwebtoken");

require("dotenv").config();

// Return the user data from the token
const me = async (req, res, next) => {

  User.getUserByUuid(req.uuid, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting user", error: err });
    }

    res.status(200).json({ message: "User found", user: results });
  });
}

const getUserByUuid = async (req, res, next) => {

  User.getUserByUuid(req.params.uuid, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting user", error: err });
    }

    res.status(200).json({ message: "User found", user: results });
  });
}

const getUserByUsername = async (req, res, next) => {

  User.getUserByUsername(req.params.username, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting user", error: err });
    }

    res.status(200).json({ message: "User found", user: results });
  });
}

const deleteUserByUuid = async (req, res, next) => {
  // Check if the post author is the same as the user
  const authorUuid = req.uuid;
  const userParamId = req.params.uuid;

  // Check if the uuid is received
  if (!userParamId || !authorUuid) {
    return res.status(400).json({ message: "Invalid inputs" });
  }
  
  if (authorUuid !== userParamId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  User.deleteUserByUuid(userParamId, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error deleting user", error: err });
    }

    res.status(200).json({ message: "User deleted", user: results });
  });
}

const getUserProfileByUuid = async (req, res, next) => {
  
    User.getUserProfileByUuid(req.params.uuid, (err, results) => {
      if (err) {
        // Send the error if there was one
        return res
          .status(500)
          .json({ message: "Error getting profile", error: err });
      }
  
      res.status(200).json({ message: "Profile found", user: results, posts: '/post/v1/user/'+results.username });
    });
}


const createFollow = async (req, res, next) => {
  const follow = new Follow({
    follower: req.uuid,
    followed: req.body.followed
  });
  
  Follow.createFollow(follow, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error creating follow" });
    }

    res.status(200).json({ message: "Follow created" });
  });
  
}

const deleteFollow = async (req, res, next) => {
  const follow = new Follow({
    follower: req.uuid,
    followed: req.body.followed
  });
  
  Follow.deleteFollow(follow, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error deleting follow", error: err });
    }

    res.status(200).json({ message: "Follow deleted" });
  });
  
}

module.exports = {
  me,
  getUserByUuid,
  getUserByUsername,
  deleteUserByUuid,
  getUserProfileByUuid,
  createFollow,
  deleteFollow
};