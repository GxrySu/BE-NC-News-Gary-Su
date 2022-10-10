const { fetchTopics } = require("../model/model.js")

exports.getTopics = (req, res) => {
    fetchTopics().then((topics) => {
        res.status(200).send(topics)
    })
}