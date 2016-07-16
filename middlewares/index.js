exports.register = (server, options, next) => {
  server.register([
    require('./auth'),
    require('./logger'),
    require('./swagger')
  ], err => {
    if (err) throw err
    next()
  })
}

exports.register.attributes = {
  name: 'middlewares'
}
