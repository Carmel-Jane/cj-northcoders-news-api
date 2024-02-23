const express = require("express");
const { getArticlesByTopic } = require("../controllers/article.controller");
const topicsRouter = express.Router();
const { getTopics } = require("../controllers/topics.controller");

topicsRouter.route("/").get(getTopics )


topicsRouter.route('/:topic').get(getArticlesByTopic)

module.exports ={ topicsRouter};