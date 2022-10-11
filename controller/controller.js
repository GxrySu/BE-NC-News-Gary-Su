const {
  fetchTopics,
  fetchArticleById,
  fetchUsers,
  updateArticleById,
} = require("../model/model.js");
//
// GET
//
exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticleById(id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};
//
// PATCH
//
exports.patchArticleById = (req, res, next) => {
  const id = req.params.article_id;
  const newVote = req.body;
  updateArticleById(id, newVote)
    .then((article) => {
      res.status(200).send( {article} );
    })
    .catch((err) => {
      next(err);
    });
};
