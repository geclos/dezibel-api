const auth = require('../core').auth
const handlePromise = require('./shared').handlePromise

exports.login = (req, reply) => handlePromise(req, reply, auth.login)
exports.loginWithOauth = (req, reply) => handlePromise(req, reply, auth.loginWithOauth)
