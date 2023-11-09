const express = require("express");
const authController = require("../../controllers/authController");

const verifyToken = require("../../controllers/middleware/verifyToken");

const router = express.Router();

router
    .get("/me", verifyToken, authController.me)
    .get("/user/:uuid", authController.getUserByUuid)
    .get("/username/:username", verifyToken, authController.getUserByUsername)
    .get("/profile/:uuid", verifyToken, authController.getUserProfileByUuid)
    .post("/signin", authController.signin)
    .post("/signup", authController.signup)
    .delete("/user/:uuid", verifyToken, authController.deleteUserByUuid),

module.exports = router;
