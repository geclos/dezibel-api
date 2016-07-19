const Hapi = require('hapi')
const throng = require('throng')
const routes = require('./routes')
const middlewares = require('./middlewares')

const WORKERS = process.env.WEB_CONCURRENCY || 1

throng({
  start,
  workers: WORKERS,
  lifetime: Infinity
})

function start () {
  const __DEV__ = process.env.NODE_ENV === 'development'
  const server = new Hapi.Server()

  server.connection({
    port: __DEV__ ? 3000 : (process.env.PORT || 3000),
    labels: [ 'api' ]
  })

  server.register([ middlewares, routes ], err => {
    if (err) throw err

    server.start((err) => {
      if (err) throw err
      server.log('info', 'Server running at: ' + server.info.uri)
    })
  })
}
