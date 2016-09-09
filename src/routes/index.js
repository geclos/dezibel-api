exports.register = (server, options, next) => {
  server.select('api').register([
    require('./auth'),
    {
      register: require('./users'),
      routes: { prefix: '/users' }
    },
    {
      register: require('./events'),
      routes: { prefix: '/events' }
    },
    {
      register: require('./offers'),
      routes: { prefix: '/offers' }
    }
  ], err => {
    if (err) throw err
    next()
  })
}

exports.register.attributes = {
  name: 'routes'
}
