const {
  fetchTopics,
  fetchArticleById,
  fetchUsers,
  fetchArticles,
  fetchCommentsByArticleId,
  updateArticleById,
  addCommentsByArticleId,
  removeCommentsByCommentId
} = require("../model/model.js");

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

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query
  fetchArticles(sort_by, order, topic)
    .then(( articles ) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const id = req.params.article_id;
  const newVote = req.body;
  updateArticleById(id, newVote)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  addCommentsByArticleId(article_id, newComment)
    .then((postedComment) => {
      res.status(201).send(postedComment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentsByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentsByCommentId(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
