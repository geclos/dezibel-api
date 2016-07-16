const AuthBearer = require('hapi-auth-bearer-token')

module.exports.register = (server, options, next) => {
  server.register(AuthBearer, err => {
    if (err) throw err

    // bearer token auth strategy
    server.auth.strategy('bearer', 'bearer-access-token', {
      allowQueryToken: false,
      allowMultipleHeaders: false,
      validateFunc: (token, callback) => {
        if (!token) callback(`Unexpected token ${typeof token}`)

        // TODO: check if token is expired...

        callback(null, true, {token: token})
      }
    })

    next()
  })
}

module.exports.register.attributes = {
  name: 'middlewares:auth'
}
