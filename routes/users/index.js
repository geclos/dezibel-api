const routes = require('./routes')

exports.register = (server, options, next) => {
  server.route(routes)
  next()
}

exports.register.attributes = {
  name: 'routes:user'
}
