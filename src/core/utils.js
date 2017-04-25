const jwt = require('jsonwebtoken')
const error = require('../shared/error')

exports.catchUnknownErrors = (reject, err) => reject(error.unknown(err))

exports.createUserObject = (user, secret) => {
  delete user.hash

  return Object.assign({}, user, secret ? {
    token: jwt.sign({accountId: user.id}, secret, {
      algorithm: 'HS256',
      expiresIn: '7 days'
    })
  } : {})
}
