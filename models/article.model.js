const db = require("../db/connection");

function readArticleById(articleId) {
  return db
    .query(
      `SELECT * FROM articles 
      WHERE article_id = $1`,
      [articleId]
    )
    .catch((err) => {
      next(err);
    });
}

module.exports = { readArticleById };
