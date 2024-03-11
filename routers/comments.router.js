
const {
  deleteComment, patchComment
} = require("../controllers/comment.controller");

const commentsRouter= require('express').Router()

commentsRouter.route('/:comment_id')
.delete(deleteComment)
.patch(patchComment)

module.exports = commentsRouter