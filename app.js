const express = require("express");
const app = express();
const { getTopics, getArticleById } = require("./controller/controller.js");
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);



app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
