const {  readArticleById, updateArticle, readArticlesByQuery} = require("../models/article.model");

function getArticles(req, res, next){
  const {topic, sort_by, order} = req.query
  readArticlesByQuery(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};


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

module.exports = { getArticles, getArticleById, patchArticle };
