const { fetchTopics, fetchArticleById } = require("../model/model.js")

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send(topics)
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticleById = (req, res, next) => {
    const id = req.params.article_id
    fetchArticleById(id).then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    })
}