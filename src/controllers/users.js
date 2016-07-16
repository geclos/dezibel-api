const users = require('../core').users

exports.get = (req, reply) => {
  users.get(req)
    .then(reply)
    .catch(err => reply(err).code(err.statusCode))
}

exports.create = (req, reply) => {
  users.create(req)
    .then(reply)
    .catch(err => reply(err).code(err.statusCode))
}

exports.update = (req, reply) => {
  users.update(req)
    .then(reply)
    .catch(err => reply(err).code(err.statusCode))
}

exports.delete = (req, reply) => {
  users.delete(req)
    .then(reply)
    .catch(err => reply(err).code(err.statusCode))
}
