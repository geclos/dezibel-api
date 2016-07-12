import Good from 'good'
import Hapi from 'hapi'
import Bcrypt from 'bcrypt'
import routes from 'routes'
import AuthBasic from 'hapi-auth-basic'
import AuthBearer from 'hapi-auth-bearer-token'

const server = new Hapi.Server()

server.connection({ port: '3000' })

// logger plugin
server.register([
  AuthBasic, // auth username + password
  AuthBearer, // auth bearer token
  {
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
  },
  {register: routes.users, options: {routes: {prefix: '/users'}}},
  {register: routes.bands, options: {routes: {prefix: '/bands'}}},
  {register: routes.places, options: {routes: {prefix: '/places'}}}
], err => {
  if (err) throw err

  server.auth.strategy('bearer', 'bearer-access-token', {
    allowQueryToken: false,
    allowMultipleHeaders: false,
    accessTokenName: 'access_token',
    validateFunc: (token, callback) => {
      if (!token) callback(`Unexpected token ${typeof token}`)

      // TODO: check if token is expired...

      callback(null, true, {token: token})
    }
  })

  server.auth.strategy('simple', 'basic', {
    validateFunc: (req, username, password, callback) => {
      // TODO: check if user exists in db...

      const user = {} // TODO: get if from db...

      Bcrypt.compare(password, user.password, (err, isValid) => {
        callback(err, isValid, { id: user.id, name: user.name })
      })
    }
  })

  server.start((err) => {
    if (err) throw err
    server.log('info', 'Server running at: ' + server.info.uri)
  })
})
