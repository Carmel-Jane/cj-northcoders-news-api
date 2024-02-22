const db = require("../db/connection");

function readCommentsByArticleId(articleId) {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [articleId]
    )
    .then((res) => {
      return res.rows;
    });
}
function insertComment(articleId, newComment) {
    const { username, body } = newComment;
  return db
    .query(
      `INSERT INTO comments (
          body, votes, author, article_id)
          VALUES
          ($1, 0, $2, $3) RETURNING *;`,
      [body, username, articleId]
    )
    .then(({ rows }) => {
        
      return rows[0];
    });
};


module.exports = {readCommentsByArticleId, insertComment};
