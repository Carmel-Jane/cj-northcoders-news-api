const {readCommentsByArticleId, insertComment, deleteCommentModel} = require('../models/comment.model')

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
function postComment(req,res,next){
    const { article_id } = req.params;
  const { body } = req;
  return Promise.all([
    insertComment(article_id, body),
  ])
    .then((result) => {

      res.status(201).send({ comment: result[result.length-1] });
    })
    .catch(next);
};
function deleteComment(req, res, next){
  const { comment_id } = req.params;
  deleteCommentModel(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};



module.exports = {getCommentsByArticleId, postComment, deleteComment}