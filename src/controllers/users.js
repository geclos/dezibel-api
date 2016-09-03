const users = require('../core').users
const error = require('../utils/error').error
const isValidUser = require('./utils').isValidUser
const handlePromise = require('./utils').handlePromise

exports.get = (req, reply) => {
  if (req.params.id) {
    if (!isValidUser(req, reply)) return replyForbidden(req, reply)
    handlePromise(req, reply, users.get)
  } else {
    handlePromise(req, reply)
  }
}

exports.create = (req, reply) => handlePromise(req, reply, users.create)

exports.update = (req, reply) => {
  if (!isValidUser(req, reply)) return replyForbidden(req, reply)
  handlePromise(req, reply, users.update)
}

exports.delete = (req, reply) => {
  if (!isValidUser(req, reply)) return replyForbidden(req, reply)
  handlePromise(req, reply, users.delete)
}

const replyForbidden = (req, reply) => reply(error.FORBIDDEN).code(403)
