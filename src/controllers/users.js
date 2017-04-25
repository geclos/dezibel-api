const users = require('../core').users
const isValidUser = require('./shared').isValidUser
const handlePromise = require('./shared').handlePromise
const replyForbidden = require('./shared').replyForbidden

exports.create = (req, reply) => handlePromise(req, reply, users.create)

exports.get = (req, reply) => {
  if (!isValidUser(req)) {
    return replyForbidden(req, reply)
  } else {
    return handlePromise(req, reply, users.get)
  }
}

exports.update = (req, reply) => {
  if (!isValidUser(req)) {
    return replyForbidden(req, reply)
  } else {
    return handlePromise(req, reply, users.update)
  }
}

exports.delete = (req, reply) => {
  if (!isValidUser(req)) {
    return replyForbidden(req, reply)
  } else {
    return handlePromise(req, reply, users.delete)
  }
}
