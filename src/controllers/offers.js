const offers = require('../core').offers
const handlePromise = require('./shared').handlePromise

exports.get = (req, reply) => handlePromise(req, reply, offers.get)
exports.create = (req, reply) => handlePromise(req, reply, offers.create)
exports.accept = (req, reply) => handlePromise(req, reply, offers.accept)
exports.reject = (req, reply) => handlePromise(req, reply, offers.reject)
exports.getInactive = (req, reply) => handlePromise(req, reply, offers.getInactive)
