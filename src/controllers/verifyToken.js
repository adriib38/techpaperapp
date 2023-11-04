const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify the token
function verifyToken(req, res, next) {
  // Check if there is a token
  const token = req.headers["x-access-token"];
  if (!token) {
    return res
      .status(403)
      .json({ auth: false, message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set the user id in the request
    req.uuid = decoded.id;

    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid, handle the error
    return res.status(401).json({ auth: false, message: "Unauthorized" });
  }
}

module.exports = verifyToken;
