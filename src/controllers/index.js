const controllers = {}

controllers.auth = require('./auth')
controllers.users = require('./users')
controllers.status = require('./status')

module.exports = controllers
