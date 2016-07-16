const auth = require('../core').auth

exports.login = (req, reply) => {
  auth.login(req)
    .then(user => reply(user))
    .catch(err => reply(err).code(err.statusCode))
}
