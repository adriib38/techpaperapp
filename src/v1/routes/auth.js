const express = require("express");
const authController = require("../../controllers/authController");

const verifyToken = require("../../controllers/middleware/verifyToken");

const router = express.Router();

router
    .post("/signin", authController.signin)
    .post("/signup", authController.signup)
    
module.exports = router;
