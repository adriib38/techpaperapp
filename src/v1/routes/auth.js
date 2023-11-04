const express = require("express");
const authController = require("../../controllers/authController");

const verifyToken = require("../../controllers/verifyToken");

const router = express.Router();

router
    .post("/signin", authController.signin)
    .post("/signup", authController.signup)
    .get("/me", verifyToken, authController.me) // Protected route with token

module.exports = router;
