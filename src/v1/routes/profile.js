const express = require("express");
const profileController = require("../../controllers/profileController");

const verifyToken = require("../../controllers/middleware/verifyToken");

const router = express.Router();

router
    .get("/me", verifyToken, profileController.me)  

module.exports = router;
