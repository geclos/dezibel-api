exports.register = (server, options, next) => {
  server
    .select('api')
    .register([
      require('./status'),
      require('./auth'),
      {
        register: require('./users'),
        routes: { prefix: '/users' }
      }
    ], err => {
      if (err) throw err
      next()
    })
}

exports.register.attributes = {
  name: 'routes'
}
