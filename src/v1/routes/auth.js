const express = require("express");
const authController = require("../../controllers/authController");

const verifyToken = require("../../controllers/middleware/verifyToken");

const router = express.Router();

router
    .post("/signin", authController.signin)
    .post("/signup", authController.signup)
    .get("/me", verifyToken, authController.me)
    .get("/user/id/:uuid", authController.getUserByUuid)
    .get("/user/username/:username", verifyToken, authController.getUserByUsername)
    .delete("/user/:uuid", verifyToken, authController.deleteUserByUuid),

module.exports = router;
