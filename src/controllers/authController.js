const User = require("../models/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// Register a new user in the database
const signup = async (req, res) => {
  let { username, email, password } = req.body;
  const user = new User({ username, email, password });

  // Encrypt the password
  password = await user.encryptPassword();

  User.createUser(user, (err, results) => {
    if (!err) {
      // Create a token
      let token = jwt.sign({ id: user.uuid }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
      });

      // Send the response if no error was thrown
      res
        .status(201)
        .json({ message: "User created", user: user, token: token });
    } else {

      // User already exists
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "User already exists" });
      }

      // Send the error if there was one
      res.status(500).json({ message: "Error creating user", error: err });
    }
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  
  User.getUserByEmail(email, async (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting user", error: err });
    }

    // If the user doesn't exist
    if (!results) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the password
    const passIsValid = await User.validatePassword(password, results.password);

    // If the password is valid
    if (passIsValid) {
      // Create a token inside the callback
      let token = jwt.sign({ id: results.uuid }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
      });

      res.status(201).json({ auth: "true", user: results, token: token });
    } else {
      res.status(401).json({ auth: "false", message: "Invalid inputs" });
    }
  });
};

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

module.exports = {
  signup,
  signin,
  me,
  getUserByUuid,
  getUserByUsername,
  deleteUserByUuid
};
