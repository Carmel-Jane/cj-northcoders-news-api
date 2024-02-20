const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");
const getAllEndpoints = require("./controllers/api.controller");

app.use(express.json());

app.get(`/api/topics`, getTopics);

app.get(`/api`, getAllEndpoints)

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "SyntaxError") {
    return res.status(400).json({ error: "Invalid JSON" });
  } else if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.status(500).json({ error: "Internal Server Error" });
});


module.exports = app;
