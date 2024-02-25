const {  readArticleById, updateArticle, readArticlesByQuery, addArticle} = require("../models/article.model");

function getArticles(req, res, next){
  const {topic, sort_by, order, limit, page} = req.query
  readArticlesByQuery(topic, sort_by, order, limit, page)
    .then(([rowCount, { rows }]) => {
      res.status(200).send({ articles: rows, total_count: rowCount });
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
function postArticle(req, res, next){
  const { body } = req;
  addArticle(body)
    .then((newArticle) => {
      const { article_id } = newArticle;
      return readArticleById(article_id);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
}
module.exports = { getArticles, getArticleById, patchArticle, postArticle };
