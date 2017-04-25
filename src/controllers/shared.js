const error = require('../shared/error')

exports.handlePromise = (req, reply, promise) => {
  return promise(req)
    .then(reply)
    .catch(err => reply(err).code(err.statusCode))
}

exports.replyForbidden = (req, reply) =>
  reply(error.FORBIDDEN).code(error.FORBIDDEN.statusCode)

exports.isValidUser = req => {
  return req.params.id.toString() === req.auth.credentials.user.id
}
