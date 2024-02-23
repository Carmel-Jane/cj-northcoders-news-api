const express = require("express");
const usersRouter = express.Router();
const { getAllUsers } = require("../controllers/users.controller");

usersRouter.route("/").get(getAllUsers);

// usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;