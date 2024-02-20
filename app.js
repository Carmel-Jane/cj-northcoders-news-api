const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const getAllEndpoints = require("./controllers/api.controller");
const {getArticles, getArticleById} = require("./controllers/article.controller");
const {handleCustomErrors, handleServerErrors, handlePsqlErrors} = require('./errors')

app.use(express.json());

app.get(`/api/topics`, getTopics);

app.get(`/api`, getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles);

app.use((request, response)=> {
    response.status(404).send({msg: "Not found"})
})  
app.use(handlePsqlErrors);
app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
