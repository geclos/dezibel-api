const db = require('./db')
const auth = require('./auth')
const logs = require('./logs')
const docs = require('./docs')
const hapiAlive = require('hapi-alive') // https://github.com/idoshamun/hapi-alive

exports.register = (server, options, next) => {
  server.register([
    hapiAlive,
    db,
    auth,
    logs,
    docs
  ], err => {
    if (err) throw err
    next()
  })
}

exports.register.attributes = {
  name: 'middlewares'
}
