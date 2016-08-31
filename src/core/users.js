const bcrypt = require('bcrypt')
const bluebird = require('bluebird')
const error = require('../utils/error')

// converts callback-based bcrypt.hash function
// into a promise-based function
const hash = bluebird.promisify(bcrypt.hash)
const saltRounds = 10

exports.get = req => new Promise((resolve, reject) => {
  const db = req.server.app.redis
  const catchUnknownErrors = err => reject(error.unknown(err))

  if (req.params.id) { // get user with id
    if (!hasPermissions(req.auth.credentials, req.params.id)) {
      return reject(error.create(403, 'Forbidden'))
    }

    db.hgetallAsync(`user:${req.params.id}`)
      .then(user => {
        if (!user) return reject(error.create(204, 'No content'))
        resolve(user)
      })
      .catch(catchUnknownErrors)
  } else { // get all users (it is paginated)
    if (req.auth.credentials.role !== 'ADMIN') {
      return reject(error.create(403, 'Forbidden'))
    }

    // get first 20 elements if no page and limit are specified
    const page = req.query.page || 0
    const limit = req.query.limit || 20
    db.lrangeAsync('users', page * (limit - 1), (page + 1) * (limit - 1))
      .then(ids => {
        if (!ids || !ids.length) {
          return reject(error.create(204, 'No content'))
        }

        const multi = db.multi()
        ids.forEach(id => multi.hgetallAsync(`user:${id}`))
        multi.execAsync()
          .then(users => {
            if (!users) return reject(error.create(204, 'No content'))
            resolve(users)
          })
          .catch(catchUnknownErrors)
      })
      .catch(catchUnknownErrors)
  }
})

exports.create = req => new Promise((resolve, reject) => {
  const db = req.server.app.redis
  const catchUnknownErrors = err => reject(error.unknown(err))

  db.lindexAsync('users', -1) // get last user's id
    .then(id => {
      if (!id) id = 0

      db.getAsync(`user:${req.payload.email}`)
        .then(user => {
          if (user) {
            return reject(error.create(403, 'User already exists'))
          }

          hash(req.payload.password, saltRounds) // hash plain text password
            .then(h => {
              const user = {
                hash: h,
                email: req.payload.email,
                name: req.payload.name || '',
                id: (parseInt(id) + 1).toString(),
                lastName: req.payload.lastName || ''
              }

              const multi = db.multi()

              // all operations required on user creation
              multi.rpush('users', user.id)
              multi.hmset(`user:${user.id}`, user)
              multi.set(`user:${user.email}`, user.id)
              multi.set(`user:${user.id}:role`, req.params.userType || 'USER')

              multi.execAsync()
                .then(() => resolve(user))
                .catch(catchUnknownErrors)
            })
            .catch(catchUnknownErrors)
        })
        .catch(catchUnknownErrors)
    })
    .catch(catchUnknownErrors)
})

exports.update = req => new Promise((resolve, reject) => {
  if (!hasPermissions(req.auth.credentials, req.params.id)) {
    return reject(error.create(403, 'Forbidden'))
  }

  const db = req.server.app.redis
  const catchUnknownErrors = err => reject(error.unknown(err))

  db.hgetallAsync(`user:${req.params.id}`)
    .then(user => {
      if (!user) {
        return reject(error.create(204, 'User not found'))
      }

      const newUser = Object.assign({}, user, {
        name: req.payload.name || user.name,
        email: req.payload.email || user.email,
        lastName: req.payload.lastName || user.lastName
      })

      db.hmsetAsync(`user:${user.id}`, newUser)
        .then(user => resolve(newUser).code(201))
        .catch(catchUnknownErrors)
    })
    .catch(catchUnknownErrors)
})

exports.delete = req => new Promise((resolve, reject) => {
  if (!hasPermissions(req.auth.credentials, req.params.id)) {
    return reject(error.create(403, 'Forbidden'))
  }

  const db = req.server.app.redis
  const catchUnknownErrors = err => reject(error.unknown(err))

  db.hgetallAsync(`user:${req.params.id}`)
    .then(user => {
      if (!user) {
        return reject(error.create(204, 'User not found'))
      }

      const multi = db.multi()
      db.del(`user:${user.email}`)
      db.del(`user:${user.id}`)
      db.lrem('users', 1, user.id)
      multi.execAsync()
        .then(res => resolve(user))
        .catch(catchUnknownErrors)
    })
    .catch(catchUnknownErrors)
})

const hasPermissions = (credentials, id) => {
  return (
    credentials &&
    credentials.role &&
    credentials.user &&
    credentials.user.id &&
    (credentials.role === 'ADMIN' || credentials.user.id === id.toString())
  )
}
