const status = require('../core').status

exports.get = (req, reply) => {
  status.get(req)
    .then(reply)
    .catch(err => reply(err).code(err.statusCode))
}
