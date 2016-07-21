const routes = require('./routes')

exports.register = (server, options, next) => {
  server.select('api').route(routes)
  next()
}

exports.register.attributes = {
  name: 'routes:status'
}
