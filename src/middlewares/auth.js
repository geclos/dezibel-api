const Bell = require('bell')

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
  console.log(process.env)
  server.app.secret = process.env.SECRET // private secret to authenticate JSON web tokens

  server.register(require('hapi-auth-jwt'), err => {
    if (err) throw err

    server.auth.strategy('jwt', 'jwt', {
      key: server.app.secret,
      validateFunction: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }
    })

    server.register(Bell, err => {
      if (err) throw err

      server.auth.strategy('facebook', 'bell', {
        provider: 'facebook',
        clientId: process.env.OAUTH_FACEBOOK_ID,
        clientSecret: process.env.OAUTH_FACEBOOK_SECRET,
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
