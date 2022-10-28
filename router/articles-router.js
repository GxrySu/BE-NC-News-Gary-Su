const {
  getArticles,
  getArticleById,
  patchArticleById,
  postCommentsByArticleId,
  getCommentsByArticleId,
} = require("../controller/controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentsByArticleId)
  .get(getCommentsByArticleId);

  module.exports = articlesRouter
