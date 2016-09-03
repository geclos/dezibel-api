const roles = require('../shared/constants').roles

const validate = (req, decodedToken, callback) => {
  Promise.all([
    req.server.app.redis.hgetallAsync(`user:${decodedToken.accountId}`),
    req.server.app.redis.getAsync(`user:${decodedToken.accountId}:role`)
  ])
    .then(results => {
      const user = results[0]
      const role = results[1]

      if (!user || !role) {
        return callback(null, false)
      } else {
        return callback(null, true, {user, role})
      }
    })
    .catch(() => callback(null, false))
}

exports.register = (server, options, next) => {
  server.app.secret = process.env.SECRET // private secret to authenticate JSON web tokens

  server.register([
    require('bell'),
    require('hapi-auth-jwt'),
    {
      register: require('hapi-authorization'),
      options: {
        roles,
        hierarchy: true
      }
    }
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
  name: 'middlewares:auth'
}
