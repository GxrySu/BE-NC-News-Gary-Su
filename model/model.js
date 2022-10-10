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
      .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
      .then(({ rows: articles }) => {
        const [article] = articles;
        if (articles.length === 0) {
          return Promise.reject({ status: 404, msg: "Not Found" });
        }
        return article;
      });
};

exports.fetchUsers = () => {
  return db
    .query("SELECT * FROM users")
    .then(({ rows: users }) => {
      return users;
  });
};
