const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db
    .query("SELECT * FROM topics")
    .then(({ rows: topics }) => {
      return topics;
    })
};

exports.fetchArticleById = (article_id) => {
  return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows: article }) => {
      if ( article.length === 0){
        return Promise.reject({ status: 404, msg: "Not Found"})
      }
        return article[0]
    })
};
