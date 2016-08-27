const Hapi = require('hapi')
const throng = require('throng')
const routes = require('./routes')
const models = require('./models')
const controllers = require('./controllers')
const middlewares = require('./middlewares')

try {
  var WORKERS = process.env.WEB_CONCURRENCY || require('os').cpus().length
} catch (e) {
  // do nothing
}

throng({
  start,
  lifetime: Infinity,
  workers: process.env.NODE_ENV === 'development' ? 1 : (WORKERS || 1)
})

function start () {
  const __DEV__ = process.env.NODE_ENV === 'development'
  const server = new Hapi.Server()

  server.connection({
    port: __DEV__ ? 3000 : (process.env.PORT || 3000),
    labels: [ 'api' ]
  })

  server.register([
    middlewares,
    controllers,
    models,
    routes
  ], err => {
    if (err) throw err

    server.start((err) => {
      if (err) throw err
      server.log('info', 'Server running at: ' + server.info.uri)
    })
  })
}
