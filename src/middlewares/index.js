exports.register = (server, options, next) => {
  server.register([
    require('./auth'),
    require('./logger'),
    require('./swagger'),
    require('blipp'),
    require('./db')
  ], err => {
    if (err) throw err
    next()
  })
}

exports.register.attributes = {
  name: 'middlewares'
}
