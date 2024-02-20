const { readArticleById} = require("../models/article.model");

function getArticleById(req, res, next){
    const articleId = req.params.article_id
  readArticleById(articleId).then((articleData) => {
    const article = articleData.rows[0];
    res.status(200).send({article});
  }) .catch(err => {
    next(err);
  });
}

module.exports = getArticleById;