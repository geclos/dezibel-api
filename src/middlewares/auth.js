const validate = (req, decodedToken, callback) => {
  req.server.app.redis.hgetallAsync(`user:${decodedToken.accountId}`)
    .then(user => {
      if (user) callback(null, true, user)
      else callback(null, false)
    })
    .catch(() => callback(null, false))
}

exports.register = (server, options, next) => {
  server.app.secret = process.env.SECRET // private secret to authenticate JSON web tokens

  server.register([
    require('bell'),
    require('hapi-auth-jwt')
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

    next()
  })
}

exports.register.attributes = {
  name: 'middlewares:auth'
}
