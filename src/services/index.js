const users = require('./users')

exports.register = (server, options, next) => {
  server.register([ users ], err => {
    if (err) throw err
    next()
  })
}

exports.register.attributes = {
  name: 'services'
}
