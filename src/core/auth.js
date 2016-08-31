const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bluebird = require('bluebird')
const error = require('../utils/error')

// converts callback-based bcrypt.compare function
// into a promise-based function
const compare = bluebird.promisify(bcrypt.compare)

exports.login = req => new Promise((resolve, reject) => {
  const db = req.server.app.redis
  const catchUnknwonErrors = err => reject(error.unknown(err))

  getUser(db, `user:${req.payload.email}`)
    .then(id => {
      return db.hgetallAsync(`user:${id}`)
    })
    .then(user => {
      compare(req.payload.password, user.hash)
        .then(areEqual => {
          if (!areEqual) {
            return reject(error.create(
              401,
              'Incorrect password'
            ))
          }

          resolve(Object.assign({}, user, {
            token: jwt.sign({accountId: user.id}, req.server.app.secret, {
              algorithm: 'HS256',
              expiresIn: '7 days'
            })
          }))
        })
        .catch(catchUnknwonErrors)
    })
    .catch(catchUnknwonErrors)
})

exports.loginWithOauth = req => new Promise((resolve, reject) => {
  if (!req.auth.isAuthenticated) {
    return reject(error.create(401, 'Authentication failed due to: ' + (req.auth.error ? req.auth.error.message : 'Unexpected error')))
  }

  const db = req.server.app.redis
  const email = req.auth.credentials.profile.email

  getUser(db, `user:${email}`)
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
      resolve(Object.assign({}, user, {
        token: jwt.sign({accountId: user.id}, req.server.app.secret, {
          algorithm: 'HS256',
          expiresIn: '7 days'
        })
      }))
    })
    .catch(err => reject(error.unknown(err)))
})

const getUser = (db, str) => {
  return new Promise((resolve, reject) => {
    db.getAsync(str)
      .then(id => {
        if (!id) {
          return reject(error.create(
            401,
            'User not found',
            'Unauthorized'
          ))
        }
        return resolve(id)
      })
      .catch(err => reject(err))
  })
}
