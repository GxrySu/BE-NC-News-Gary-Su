const db = require("../db/connection.js");

//
//FETCH
//
exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows: topics }) => {
    return topics;
  });
};

exports.fetchArticleById = (article_id) => {
  const id = Number(article_id);
  if (typeof id === "number")
    return db
      .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
      .then(({ rows }) => {
        const [article] = rows;
        if (rows.length === 0) {
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
//
//UPDATE
//
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
