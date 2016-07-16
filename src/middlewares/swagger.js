const Inert = require('inert')
const Vision = require('vision')
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
    Inert,
    Vision,
    {
      'register': HapiSwagger,
      'options': swaggerOptions
    }
  ], (err) => {
    if (err) throw err
    next()
  })
}

module.exports.register.attributes = {
  name: 'middlewares:swagger'
}
