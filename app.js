const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const getAllEndpoints = require("./controllers/api.controller");
const {
  getArticles,
  getArticleById, patchArticle
} = require("./controllers/article.controller");
const {getCommentsByArticleId, postComment, deleteComment} = require('./controllers/comment.controller')
const {
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./errors");

app.use(express.json());

app.get(`/api`, getAllEndpoints);

app.get(`/api/topics`, getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchArticle)

app.delete("/api/comments/:comment_id", deleteComment)

app.use((request, response) => {
  response.status(404).send({ msg: "404 Error. This page doesn't exist" });
});
app.use(handlePsqlErrors);
app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
