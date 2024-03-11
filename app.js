const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");
const articlesRouter = require("./routers/articles.router");
const commentsRouter = require("./routers/comments.router");
const {topicsRouter} = require("./routers/topics.router");
const usersRouter = require("./routers/users.router");
const {
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./errors");
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/users", usersRouter);

app.use((request, response) => {
  response.status(404).send({ msg: "404 Error. This page doesn't exist" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;