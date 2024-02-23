const express = require("express");
const commentsRouter = express.Router();
const {
  deleteComment, patchComment
} = require("../controllers/comment.controller");

commentsRouter.route('/:comment_id')
.delete(deleteComment)
.patch(patchComment)

module.exports = commentsRouter