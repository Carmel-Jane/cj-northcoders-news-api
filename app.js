const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controller");

app.use(express.json());

app.get(`/api/topics`, getTopics);

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "SyntaxError") {
    return res.status(400).json({ error: "Invalid JSON" });
  } else if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.status(500).json({ error: "Internal Server Error" });
});
app.listen(9090, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("server is listening on port 9090");
  }
});

module.exports = app;
