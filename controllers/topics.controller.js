const { readTopics, addTopic} = require("../models/topics.model");

function getTopics(req, res, next){
    readTopics()
      .then(topics => {
        res.status(200).send(topics);
      })
      .catch(err => {
        next(err);
      });
  };
function postTopic(req,res,next){
  const {body }= req
  addTopic(body)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
}
  module.exports = { getTopics, postTopic };