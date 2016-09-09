const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bluebird = require('bluebird')
const error = require('../shared/error')
const catchUnknownErrors = require('./utils').catchUnknownErrors

// converts callback-based bcrypt.compare function
// into a promise-based function
const compare = bluebird.promisify(bcrypt.compare)

exports.login = req => new Promise((resolve, reject) => {
  const db = req.server.app.redis

  getUser(db, `user:${req.payload.email}`)
    .then(id => db.hgetallAsync(`user:${id}`))
    .then(user => {
      compare(req.payload.password, user.hash)
        .then(areEqual => {
          if (!areEqual) return reject(error.create(401, 'Incorrect password'))
          resolve(createUserObject(user, req.server.app.secret))
        })
        .catch(catchUnknownErrors.bind(null, reject))
    })
    .catch(catchUnknownErrors.bind(null, reject))
})

exports.loginWithOauth = req => new Promise((resolve, reject) => {
  if (!req.auth.isAuthenticated) {
    return reject(error.create(401, 'Authentication failed due to: ' + (req.auth.error ? req.auth.error.message : 'Unexpected error')))
  }

  const db = req.server.app.redis
  const email = req.auth.credentials.profile.email

  getUser(db, `user:${email}`)
    .then(id => db.hgetallAsync(`user:${id}`))
    .then(user => resolve(createUserObject(user, req.server.app.secret)))
    .catch(catchUnknownErrors.bind(null, reject))
})

const createUserObject = (user, secret) => Object.assign({}, user, {
  token: jwt.sign({accountId: user.id}, secret, {
    algorithm: 'HS256',
    expiresIn: '7 days'
  })
})

const getUser = (db, str) => {
  return new Promise((resolve, reject) => {
    db.getAsync(str)
      .then(id => {
        if (!id) return reject(error.UNAUTHORIZED)
        return resolve(id)
      })
      .catch(err => error.unkown(err))
  })
}
