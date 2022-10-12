const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows: topics }) => {
    return topics;
  });
};

exports.fetchArticleById = (article_id) => {
  const id = Number(article_id);
  if (typeof id === "number")
    return db
      .query(
        `SELECT articles.*,count(comments.comment_id)::INT 
      AS comment_count FROM articles 
      LEFT JOIN comments ON comments.article_id = articles.article_id 
      WHERE articles.article_id = $1 
      GROUP BY articles.article_id;`,
        [article_id]
      )
      .then(({ rows: articles }) => {
        const [article] = articles;
        if (articles.length === 0) {
          return Promise.reject({ status: 404, msg: "ID Not Found" });
        }
        return article;
      });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows: users }) => {
    return users;
  });
};

exports.fetchArticles = (sort_by = "created_at", order = "desc") => {
  const allowedOrder = ["ASC", "DESC"];
  const inputOrder = order.toUpperCase();
  const allowedSortBy = ["title", "topic", "author", "created_at", "votes"];
  if (!allowedSortBy.includes(sort_by) || !allowedOrder.includes(inputOrder)) {
    return Promise.reject({ status: 400, msg: "Invalid Query Request" });
  }
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count 
       FROM articles 
       LEFT JOIN comments ON comments.article_id = articles.article_id
       GROUP BY articles.article_id
       ORDER BY ${sort_by} ${inputOrder};`
    )
    .then(({ rows: articles }) => {
      return articles;
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body 
       FROM comments 
       WHERE article_id = $1
       ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows: comments }) => {
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return comments;
    });
};

exports.updateArticleById = (article_id, newVote) => {
  if (
    !newVote.hasOwnProperty("inc_votes") ||
    typeof newVote.inc_votes !== "number"
  ) {
    return Promise.reject({ status: 400, msg: "Invalid Request" });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $2 
       WHERE article_id = $1 RETURNING *;`,
       [article_id, newVote.inc_votes]
    )
    .then(({ rows }) => {
      const [article] = rows;
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID Not Found" });
      }
      return article;
    });
};

exports.addCommentsByArticleId = (article_id, newComment) => {
  
  const { body, username } = newComment;
  if (typeof username !== 'string' || typeof body !== 'string') {
    return Promise.reject({ status: 400, msg: "Invalid Request" })
  }
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Invalid Request" });
  }
  return db
    .query(
      `INSERT INTO comments (body, author, article_id)
       VALUES ($1, $2, $3) RETURNING *;`, 
       [body, username, article_id]
    )
    .then(({ rows: comment }) => {
      return comment;
    });
};
