const { readArticlesSortByDate, readArticleById, updateArticle, readArticleByTopic} = require("../models/article.model");

function getArticles(req, res, next) {
  const { topic } = req.query;

  if (topic) {
    
    getArticlesByTopic(req, res, next);
  } else {
  readArticlesSortByDate()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
}}

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
function patchArticle(req, res, next){
  const { article_id } = req.params;
  const { body } = req;
  updateArticle(article_id, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function getArticlesByTopic(req, res, next){
  const { topic } = req.query;
  readArticleByTopic(topic)
 
    .then((articles) => {
    
      res.status(200).send({ articles });
    })
    .catch(next);
};
module.exports = { getArticles, getArticleById, patchArticle, getArticlesByTopic };
