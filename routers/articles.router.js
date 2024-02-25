const express = require("express");
const articlesRouter = express.Router();
const {
  getArticles,
  getArticleById,
  patchArticle,
  postArticle,
  deleteArticle
} = require("../controllers/article.controller");
const {
  getCommentsByArticleId,
  postComment,
} = require("../controllers/comment.controller");

articlesRouter.route("/").get(getArticles).post(postArticle)

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle).delete(deleteArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
