const readCommentsByArticleId = require('../models/comment.model')

function getCommentsByArticleId(req, res, next){
    const articleId = req.params.article_id;
    readCommentsByArticleId(articleId)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = getCommentsByArticleId