const good = require('good')

module.exports.register = (server, options, next) => {
  server.register([
    {
      register: good,
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
    }
  ], err => {
    if (err) throw err
    next()
  })
}

module.exports.register.attributes = {
  name: 'logs'
}
