const db = require("../db/connection");

function readArticlesSortByDate() {
  return db
    .query("SELECT * FROM articles ORDER BY created_at DESC")
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      next(err);
    });
}

function readArticleById(articleId) {
  return db
    .query(
      `SELECT * FROM articles 
      WHERE article_id = $1`,
      [articleId]
    )
    .then((articleById) => {
      if (articleById.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${articleId}`,
        });
      }
      return articleById.rows[0];
    });
}
function updateArticle(articleId, update){
  return db
    .query(
      `UPDATE articles
    SET
      votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,
      [update.inc_votes, articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 Error. This article doesn't exist" });
      }
      return rows[0];
    });
};
module.exports = { readArticlesSortByDate, readArticleById, updateArticle }
