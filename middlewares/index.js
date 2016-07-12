const middlewares = {}

middlewares.auth = require('./auth')
middlewares.logger = require('./logger')
middlewares.swagger = require('./swagger')

module.exports = middlewares
