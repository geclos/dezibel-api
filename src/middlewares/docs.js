const pack = require('../../package.json')
const HapiSwagger = require('hapi-swagger')

const swaggerOptions = {
  info: {
    title: 'Dezibel API Documentation',
    'version': pack.version
  }
}

module.exports.register = (server, options, next) => {
  server.register([
    require('inert'),
    require('vision'),
    {
      'register': HapiSwagger,
      'options': swaggerOptions
    },
    require('blipp'), // prints all routes on console during app startup
    require('tv') // create a page to display server logs
  ], (err) => {
    if (err) throw err
    next()
  })
}

module.exports.register.attributes = {
  name: 'middlewares:swagger'
}
