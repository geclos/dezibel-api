const Good = require('good')

module.exports.register = (server, options, next) => {
  server.register({
    register: Good,
    options: {
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            response: '*',
            log: '*'
          }]
        }, {
          module: 'good-console'
        }, 'stdout']
      }
    }
  })

  next()
}

module.exports.register.attributes = {
  name: 'middlewares:logger'
}
