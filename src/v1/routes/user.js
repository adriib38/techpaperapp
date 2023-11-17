const express = require("express");
const userController = require("../../controllers/userController");

const verifyToken = require("../../controllers/middleware/verifyToken");

const router = express.Router();

router
    .get("/me", verifyToken, userController.me)
    .get("/:uuid", userController.getUserByUuid)
    .get("/username/:username", verifyToken, userController.getUserByUsername)
    .get("/profile/:uuid", verifyToken, userController.getUserProfileByUuid)
    .delete("/user/:uuid", verifyToken, userController.deleteUserByUuid)
    .post("/follow", verifyToken, userController.createFollow)
    .delete("/follow", verifyToken, userController.deleteFollow)
    .get("/follows/:uuid", verifyToken, userController.getFollowsByUuid)
    .get("/followers/:uuid", verifyToken, userController.getFollowersByUuid);

module.exports = router;
