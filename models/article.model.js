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
      `SELECT 
    articles.article_id, articles.author, articles.title, articles.topic, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments On articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
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
const checkTopicExists = async (topic) => {
  const dbOutput = await db.query(
    'SELECT * FROM topics WHERE slug = $1;',
    [topic]
  );

  if (dbOutput.rows.length === 0) {
    
    return Promise.reject({ status: 404, msg: "404 Error. This topic doesn't exist" })}
    else {
   
      return dbOutput.rows[0]; 
    }
  ;
  }

function readArticleByTopic(topic){

  return checkTopicExists(topic).then(()=>{
      return db.query(`SELECT * FROM articles WHERE topic = $1`, [topic])
    .then(({ rows }) => {
      return rows;
    })
  })
  .catch((error) => {
      
      return Promise.reject(error);
  })
};
module.exports = { readArticlesSortByDate, readArticleById, updateArticle, readArticleByTopic }
