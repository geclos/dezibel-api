const auth = require('../core').auth
const handlePromise = require('./utils').handlePromise

exports.login = (req, reply) => handlePromise(req, reply, auth.login)
exports.loginWithOauth = (req, reply) => handlePromise(req, reply, auth.loginWithOauth)
