const apiRouter = require("express").Router()
const { getApi } = require('../controller/controllers')

apiRouter.get('/', getApi);

module.exports = apiRouter;