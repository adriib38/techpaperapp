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
        expiresIn: 86400, // 24 hours
      });

      // Send the response if no error was thrown
      res
        .status(201)
        .json({ message: "User created", user: user, token: token });
    } else {
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

    // Verify the password
    const passIsValid = await User.validatePassword(password, results.password);

    // If the password is valid
    if (passIsValid) {
      // Create a token inside the callback
      let token = jwt.sign({ id: results.uuid }, process.env.JWT_SECRET, {
        expiresIn: 86400, // 24 hours
      });

      res.status(201).json({ auth: "true", user: results, token: token });
    } else {
      res.status(401).json({ auth: "false", message: "Invalid inputs" });
    }
  });
};

// Test endpoint to check if the user is authenticated
const me = async (req, res, next) => {

  User.getUserById(req.uuid, (err, results) => {
    if (err) {
      // Send the error if there was one
      return res
        .status(500)
        .json({ message: "Error getting user", error: err });
    }

    res.status(200).json({ message: "User found", user: results });
  }
  );
}

module.exports = {
  signup,
  signin,
  me,
};
