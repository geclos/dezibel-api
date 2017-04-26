const bell = require('bell')
const hapiJWT = require('hapi-auth-jwt')

const validate = (req, decodedToken, callback) => {
  req.server.app.redis.hgetallAsync(`user:${decodedToken.accountId}`)
    .then(user => {
      if (!user) return callback(null, false)
      return callback(null, true, {user})
    })
    .catch(() => callback(null, false))
}

exports.register = (server, options, next) => {
  server.app.secret = process.env.SECRET // private secret to authenticate JSON web tokens

  server.register([
    bell,
    hapiJWT
  ], err => {
    if (err) throw err

    server.auth.strategy('jwt', 'jwt', {
      key: server.app.secret,
      validateFunc: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }
    })

    server.auth.strategy('facebook', 'bell', {
      provider: 'facebook',
      password: server.app.secret,
      clientId: process.env.OAUTH_FACEBOOK_ID,
      clientSecret: process.env.OAUTH_FACEBOOK_SECRET,
      isSecure: process.env.NODE_ENV === 'production'
    })

    // all routes we'll use this auth strategy by default
    // set config.auth property of route to false
    server.auth.default('jwt')

    next()
  })
}

exports.register.attributes = {
  name: 'auth'
}
