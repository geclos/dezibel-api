const oauth = require('../config').oauth
const secret = require('../config').secret

const validate = function (req, decodedToken, callback) {
  req.server.app.redis.hgetallAsync(`user:${decodedToken.accountId}`)
    .then(user => {
      if (user) {
        callback(undefined, true, user)
      } else {
        callback('Unauthorized', false, {})
      }
    })
    .catch(err => callback(err, true, {}))
}

module.exports.register = (server, options, next) => {
  server.app.secret = secret // private secret to authenticate JSON web tokens

  server.register(require('hapi-auth-jwt'), err => {
    if (err) throw err

    server.auth.strategy('jwt', 'jwt', {
      key: server.app.secret,
      validateFunction: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }
    })

    server.register(require('bell'), err => {
      if (err) throw err

      server.auth.strategy('facebook', 'bell', {
        provider: 'facebook',
        clientId: oauth.facebook.id,
        clientSecret: oauth.facebook.secret,
        password: server.app.secret,
        isSecure: process.env.NODE_ENV === 'production'
      })

      next()
    })
  })
}

module.exports.register.attributes = {
  name: 'middlewares:auth'
}
