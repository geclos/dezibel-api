const bcrypt = require('bcrypt')
const bluebird = require('bluebird')
const error = require('../utils/error')

// converts callback-based bcrypt.compare function
// into a promise-based function
const compare = bluebird.promisify(bcrypt.compare)

exports.login = (req, reply) => {
  const db = req.server.app.redis
  db.get(`user:${req.body.email}`)
    .then(id => db.hgetall(`user:${id}`))
    .then(user => {
      if (!user) {
        return reply(error.create(
          401,
          'User not found',
          'Unauthorized'
        )).code(401)
      }

      compare(req.body.password, user.hash)
        .then(areEqual => {
          if (!areEqual) {
            return reply(error.create(
              401,
              'Incorrect password',
              'Unauthorized'
            )).code(401)
          }

          reply(user)
        })
        .catch(err => reply(500, err.message).code(500))
    })
    .catch(err => reply(500, err.message).code(500))
}
