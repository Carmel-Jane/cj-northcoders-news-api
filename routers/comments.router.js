const express = require("express");
const commentsRouter = express.Router();
const {

  deleteComment,
} = require("../controllers/comment.controller");

commentsRouter.route('/:comment_id')
.delete(deleteComment)


module.exports = commentsRouter