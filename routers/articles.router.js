const express = require("express");
const articlesRouter = express.Router();
const {
  getArticles,
  getArticleById,
  patchArticle,
  getArticlesByTopic,
} = require("../controllers/article.controller");
const {
  getCommentsByArticleId,
  postComment,
} = require("../controllers/comment.controller");

articlesRouter.route("/").get(getArticles, getArticlesByTopic);

// articlesRouter.route('/:topic').get(getArticlesByTopic)

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
