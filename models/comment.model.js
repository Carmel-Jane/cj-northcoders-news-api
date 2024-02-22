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
const checkIfUsernameExists = async (username) => {
  const dbOutput = await db.query(
    'SELECT * FROM users WHERE username = $1;',
    [username]
  );

  if (dbOutput.rows.length === 0) {
    // resource does NOT exist
    return Promise.reject({ status: 404, msg: "404 Error. This username doesn't exist" });
  }
};

function insertComment(articleId, newComment) {
  const { username, body } = newComment;
  return checkIfUsernameExists(username)
    .then(() => {
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
    })
    .catch((error) => {
      // Handle the error from checkIfUsernameExists
      return Promise.reject(error);
    });
}
function deleteCommentModel(commentId) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [commentId])
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "404 Error. Comment doesn't exist" });
      }
    });
}

module.exports = { readCommentsByArticleId, insertComment, deleteCommentModel };