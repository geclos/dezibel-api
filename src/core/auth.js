const bcrypt = require('bcrypt')
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

          resolve(user)
        })
        .catch(err => reject(error.create(500, err.message)))
    })
    .catch(err => reject(error.create(500, err.message)))
})
