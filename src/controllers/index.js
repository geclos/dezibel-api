const controllers = {
  auth: require('./auth'),
  users: require('./users'),
  events: require('./events')
}

exports.register = (server, options, next) => {
  server.expose('controllers', controllers)
  next()
}

exports.register.attributes = { name: 'controllers' }
