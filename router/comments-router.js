const { deleteCommentsByCommentId } = require("../controller/controllers");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteCommentsByCommentId);

module.exports = commentsRouter