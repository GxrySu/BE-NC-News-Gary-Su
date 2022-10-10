const express = require("express");
const app = express();
const { getTopics } = require("./controller/controller.js")
app.use(express.json())

app.get("/api/topics", getTopics)





app.use('/*', (req, res) => {
    res.status(404).send({ msg : 'Path not found!'})
})
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });
app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
  });

module.exports = app;