const db = require("../db/connection");
const {checkIfUsernameExists} = require("./comment.model")

function readAllArticles() {
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
function updateArticle(articleId, update) {
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
        return Promise.reject({
          status: 404,
          msg: "404 Error. This article doesn't exist",
        });
      }
      return rows[0];
    });
}
const checkTopicExists = async (topic) => {
  const dbOutput = await db.query("SELECT * FROM topics WHERE slug = $1;", [
    topic,
  ]);

  if (dbOutput.rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "404 Error. This topic doesn't exist",
    });
  } else {
    return dbOutput.rows[0];
  }
};
async function readArticlesByQuery(
  topic,
  sort_by = "created_at",
  order = "desc",
  limit = 10,
  page = 1
) {
  if (topic) {
    await checkTopicExists(topic);
  }

  const queryValues = [];
  const offset = (page - 1) * limit;
  let queryStr = `SELECT 
  articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count 
  FROM articles 
  LEFT JOIN comments On articles.article_id = comments.article_id`;

  if (topic) {
    queryValues.push(topic);
    queryStr += ` WHERE topic = $1`;
  }

  queryStr += ` GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order}`;

  return db
    .query(queryStr, queryValues)
    .then(({ rows }) => {
      queryValues.push(limit);
      queryStr += ` LIMIT $${queryValues.length}`;

      queryValues.push(offset);
      queryStr += ` OFFSET $${queryValues.length}`;

      const pageRows = db.query(queryStr, queryValues);

      return Promise.all([rows.length, pageRows]);
    })
    .then((promises) => {
      return promises;
    });
};
  
function addArticle(newArticle){
  const { author, title, body, topic } = newArticle;
  return checkTopicExists(topic).then(() => {
  return checkIfUsernameExists(author).then(() => {
  return db
    .query(
      `INSERT INTO articles 
  (author, title, body, topic, votes)
  VALUES
  ($1, $2, $3, $4, 0) RETURNING *;`,
      [author, title, body, topic]
    )
    .then(({ rows }) => {
      return rows[0];
    });
  })
})
}

//function readArticlesByQuery(topic, sort_by = "created_at", order = "desc", limit = 10, page = 1) {
//   if (
//     ![
//       "article_id",
//       "author",
//       "title",
//       "topic",
//       "created_at",
//       "votes",
//       "article_img_url",
//       "comment_count",
//     ].includes(sort_by) ||
//     !["asc", "desc"].includes(order)
//   ) {
//     return Promise.reject({ status: 400, msg: "Bad request" });
//   }

//   if (!topic && sort_by === "created_at" && order === "desc") {
//     return readAllArticles();
//   } else {
//     if (topic) {
//       return checkTopicExists(topic).then((topicRow) => {
//         if (!topicRow) {
//           return Promise.reject({ status: 404, msg: "Topic not found" });
//         }

//         const queryValues = [topicRow.slug];
//         const offset = (page - 1) * limit;
//         let queryStr = `SELECT 
//           articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count 
//           FROM articles 
//           LEFT JOIN comments ON articles.article_id = comments.article_id
//           WHERE articles.topic = $1`;

//         queryStr += ` GROUP BY articles.article_id
//         ORDER BY articles.${sort_by} ${order}
//         LIMIT $2 OFFSET $3`;

//         queryValues.push(limit);
//         queryValues.push(offset);

//         return db.query(queryStr, queryValues).then(({ rows }) => {
//           return rows;
//         });
//       });
//     } else {
//       const queryValues = [];
//       const offset = (page - 1) * limit;
//       let queryStr = `SELECT 
//         articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count 
//         FROM articles 
//         LEFT JOIN comments ON articles.article_id = comments.article_id`;

//       queryStr += ` GROUP BY articles.article_id
//       ORDER BY articles.${sort_by} ${order}
//       LIMIT $1 OFFSET $2`;

//       queryValues.push(limit);
//       queryValues.push(offset);

//       return db.query(queryStr, queryValues).then(({ rows }) => {
//         return rows;
//       });
//     }
//   }
// //}

module.exports = {
  readArticleById,
  updateArticle,
  readArticlesByQuery,
  addArticle
};
