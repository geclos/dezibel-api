const users = require('../core').users

exports.get = (req, reply) => {
  users.get(req)
    .then(reply)
    .catch(err => replyError(err, reply))
}

exports.create = (req, reply) => {
  users.create(req)
    .then(reply)
    .catch(err => replyError(err, reply))
}

exports.update = (req, reply) => {
  users.update(req)
    .then(reply)
    .catch(err => replyError(err, reply))
}

exports.delete = (req, reply) => {
  users.delete(req)
    .then(reply)
    .catch(err => replyError(err, reply))
}

const replyError = (err, reply) => reply(err).code(err.statusCode)
