exports.register = (server, options, next) => {
  server.register([
    require('./db'),
    require('./auth'),
    require('./logs'),
    require('./docs')
  ], err => {
    if (err) throw err
    next()
  })
}

exports.register.attributes = {
  name: 'middlewares'
}
