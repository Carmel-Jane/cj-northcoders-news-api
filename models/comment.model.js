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

module.exports = readCommentsByArticleId;
