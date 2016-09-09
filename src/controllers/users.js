const users = require('../core').users
const isValidUser = require('./shared').isValidUser
const handlePromise = require('./shared').handlePromise
const replyForbidden = require('./shared').replyForbidden

exports.create = (req, reply) => handlePromise(req, reply, users.create)

exports.get = (req, reply) => {
  if (req.params.id) {
    if (!isValidUser(req, reply)) {
      return replyForbidden(req, reply)
    } else {
      return handlePromise(req, reply, users.get)
    }
  } else {
    return handlePromise(req, reply)
  }
}

exports.update = (req, reply) => {
  if (!isValidUser(req, reply)) {
    return replyForbidden(req, reply)
  } else {
    return handlePromise(req, reply, users.update)
  }
}

exports.delete = (req, reply) => {
  if (!isValidUser(req, reply)) {
    return replyForbidden(req, reply)
  } else {
    return handlePromise(req, reply, users.delete)
  }
}
