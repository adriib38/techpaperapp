const User = require("../models/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const verifyUser = require("./middleware/verifyUser");

// Register a new user in the database
const signup = async (req, res) => {
  let { username, email, password } = req.body;

  // Format the data
  username = username.toLowerCase().trim().replace(/\s+/g, "");
  email = email.toLowerCase().trim().replace(/\s+/g, "");
  password = password.trim();

  const user = new User({ username, email, password });

  const verificationResult = verifyUser(user);
  if(verificationResult.error) {
    return res.status(400).json({ "created": false, "message": verificationResult.message });
  }

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
        .json({ created: true, message: "User created", user: user, token: token });
    } else {

      // User already exists
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ created: false, message: err.sqlMessage });
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
      res.status(401).json({ auth: "false", message: "Invalid password" });
    }
  });
};


module.exports = {
  signup,
  signin,
};
