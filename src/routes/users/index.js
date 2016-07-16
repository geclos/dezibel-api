const routes = require('./routes')

exports.register = (server, options, next) => {
  const api = server.select('api')
  api.route(routes)
  next()
}

exports.register.attributes = {
  name: 'routes:user'
}
