const Hapi = require('hapi')
const routes = require('./routes')
const middlewares = require('./middlewares')
// import * as routes from 'routes'

const __DEV__ = process.env.NODE_ENV === 'development'
const server = new Hapi.Server()

server.connection({
  port: __DEV__ ? 3000 : process.env.PORT,
  labels: [ 'api' ]
})

server.register([
  middlewares.logger,
  middlewares.swagger,
  middlewares.auth
], err => {
  if (err) throw err

  server.route(routes.auth)
  server.route(routes.users)

  server.start((err) => {
    if (err) throw err
    server.log('info', 'Server running at: ' + server.info.uri)
  })
})
