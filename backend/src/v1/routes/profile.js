const express = require("express");
const profileController = require("../../controllers/profileController");

const verifyToken = require("../../controllers/middleware/verifyToken");

const router = express.Router();

router
    .get("/me", verifyToken, profileController.me)  
    .get("/u/:username", verifyToken, profileController.getProfileByUsername)

module.exports = router;
