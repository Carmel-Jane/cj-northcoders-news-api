const { readTopics } = require("../models/topics.model");

function getTopics(req, res, next){
    readTopics()
      .then(topics => {
        res.status(200).send(topics);
      })
      .catch(err => {
        next(err);
      });
  };

  module.exports = { getTopics };