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

module.exports = { readTopics };
