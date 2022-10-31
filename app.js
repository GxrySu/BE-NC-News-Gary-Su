const express = require("express");
const apiRouter = require("./router/api-router");
const app = express();
const cors = require('cors')
const {
  getApi,
  getTopics,
  getArticleById,
  getUsers,
  getArticles,
  getCommentsByArticleId,
  patchArticleById,
  postCommentsByArticleId,
  deleteCommentsByCommentId
} = require("./controller/controllers.js");
app.use(express.json());
app.use(cors())

app.use("/api", apiRouter)

// app.get("/api", getApi)
// app.get("/api/topics", getTopics);
// app.get("/api/articles/:article_id", getArticleById);
// app.get("/api/users", getUsers);
// app.get("/api/articles", getArticles);
// app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

// app.patch("/api/articles/:article_id", patchArticleById);

// app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

// app.delete("/api/comments/:comment_id", deleteCommentsByCommentId)

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});
app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "ID not Found" });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid request" });
  } else next(err);
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
