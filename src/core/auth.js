const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bluebird = require('bluebird')
const error = require('../utils/error')

// converts callback-based bcrypt.compare function
// into a promise-based function
const compare = bluebird.promisify(bcrypt.compare)

exports.login = req => new Promise((resolve, reject) => {
  const db = req.server.app.redis

  db.getAsync(`user:${req.payload.email}`)
    .then(id => {
      if (!id) {
        return reject(error.create(
          401,
          'User not found',
          'Unauthorized'
        ))
      }

      return db.hgetallAsync(`user:${id}`)
    })
    .then(user => {
      if (process.env.NODE_ENV === 'test') {
        return resolve(user) // this is for testing purposes
      }

      compare(req.payload.password, user.hash)
        .then(areEqual => {
          if (!areEqual) {
            return reject(error.create(
              401,
              'Incorrect password',
              'Unauthorized'
            ))
          }

          resolve(Object.assign({}, user, {
            token: jwt.sign({accountId: user.id}, req.server.app.secret, {
              algorithm: 'HS256',
              expiresIn: '7 days'
            })
          }))
        })
        .catch(err => reject(error.create(500, err.message)))
    })
    .catch(err => reject(error.create(500, err.message)))
})

exports.loginWithOauth = req => new Promise((resolve, reject) => {
  if (!req.auth.isAuthenticated) {
    return reject(error.create(401, 'Authentication failed due to: ' + (req.auth.error ? req.auth.error.message : 'Unexpected error')))
  }

  const db = req.server.app.redis
  const email = req.auth.credentials.profile.email

  db.getAsync(`user:${email}`)
    .then(id => {
      if (!id) {
        return reject(error.create(
          401,
          'User not found',
          'Unauthorized'
        ))
      }

      return db.hgetallAsync(`user:${id}`)
    })
    .then(user => {
      if (process.env.NODE_ENV === 'test') {
        return resolve(user) // this is for testing purposes
      }

      resolve(Object.assign({}, user, {
        token: jwt.sign({accountId: user.id}, req.server.app.secret, {
          algorithm: 'HS256',
          expiresIn: '7 days'
        })
      }))
    })
    .catch(err => reject(error.create(500, err.message)))
})
