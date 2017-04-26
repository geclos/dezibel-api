require('dotenv').config()

const os = require('os')
const Hapi = require('hapi')
const throng = require('throng')
const routes = require('./routes')
const models = require('./models')
const services = require('./services')
const controllers = require('./controllers')
const middlewares = require('./middlewares')

const __DEV__ = process.env.NODE_ENV === 'development'
const server = new Hapi.Server()

server.connection({
  labels: ['api'],
  port: __DEV__ ? 3000 : (process.env.PORT || 3000),
  routes: {
    plugins: {
      hapiAuthoriation: {
        roles: ['ADMIN'] // default role for all endpoints
      }
    }
  }
})

server.register([
  middlewares,
  controllers,
  services,
  models,
  routes
], err => {
  if (err) throw err

  server.start((err) => {
    if (err) throw err
    server.log('info', 'Server running at: ' + server.info.uri)
  })
})

module.exports = server
