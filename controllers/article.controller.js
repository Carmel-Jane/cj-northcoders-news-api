const { readArticlesSortByDate, readArticleById} = require("../models/article.model");

function getArticles(req, res, next) {
  readArticlesSortByDate()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleById(req, res, next) {
  const articleId = req.params.article_id;
  readArticleById(articleId)
    .then((articleData) => {
      const article = articleData;
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticles, getArticleById };
