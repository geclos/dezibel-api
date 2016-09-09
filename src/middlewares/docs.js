const tv = require('tv') // create a page to display server logs
const inert = require('inert')
const blipp = require('blipp') // prints all routes on console during app startup
const vision = require('vision')
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
    inert,
    vision,
    {
      'register': HapiSwagger,
      'options': swaggerOptions
    },
    tv,
    blipp
  ], (err) => {
    if (err) throw err
    next()
  })
}

module.exports.register.attributes = {
  name: 'middlewares:swagger'
}
