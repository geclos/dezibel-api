const bcrypt = require('bcrypt')
const bluebird = require('bluebird')
const error = require('../shared/error')
const { createUserObject, catchUnknownErrors } = require('./utils')

// converts callback-based bcrypt.compare function
// into a promise-based function
const compare = bluebird.promisify(bcrypt.compare)

exports.login = req => new Promise((resolve, reject) => {
  const users = req.server.app.users
  const secret = req.server.app.secret

  users.getFromEmail(req.payload.email)
    .then(user => {
      compare(req.payload.password, user.hash)
        .then(areEqual => {
          if (!areEqual) return reject(error.create(401, 'Incorrect password'))
          resolve(createUserObject(user, secret))
        })
        .catch(catchUnknownErrors.bind(null, reject))
    })
    .catch(catchUnknownErrors.bind(null, reject))
})

exports.loginWithOauth = req => new Promise((resolve, reject) => {
  if (!req.auth.isAuthenticated) {
    return reject(error.create(401, 'Authentication failed due to: ' +
      (req.auth.error ? req.auth.error.message : 'Unexpected error')
    ))
  }

  const email = req.auth.credentials.profile.email
  const users = req.server.app.users
  const secret = req.server.app.secret

  users.getFromEmail(email)
    .then(user => resolve(createUserObject(user, secret)))
    .catch(catchUnknownErrors.bind(null, reject))
})
