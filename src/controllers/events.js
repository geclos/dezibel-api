const events = require('../core').events
const handlePromise = require('./shared').handlePromise

exports.get = (req, reply) => handlePromise(req, reply, events.get)
exports.create = (req, reply) => handlePromise(req, reply, events.create)
exports.update = (req, reply) => handlePromise(req, reply, events.update)
exports.delete = (req, reply) => handlePromise(req, reply, events.delete)
exports.findNear = (req, reply) => handlePromise(req, reply, events.findNear)
