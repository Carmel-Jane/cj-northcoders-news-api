const db = require("../db/connection");

function readTopics() {
  return db
    .query("SELECT * FROM topics")
    .then((res) => {
      return res.rows;
    })
    .catch((err) => {
      next(err);
    });
}
function addTopic(topic){
const { slug, description } = topic;
return db
  .query(
    `INSERT INTO topics 
  (slug, description)
  VALUES
  ($1, $2) RETURNING *`,
    [slug, description]
  )
  .then(({ rows }) => {
    return rows[0];
  });}

module.exports = { readTopics, addTopic };
