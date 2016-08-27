const bcrypt = require('bcrypt')
const bluebird = require('bluebird')
const error = require('../shared/constants').error
const getValidUserType = require('../shared/constants').getValidUserType

// converts callback-based bcrypt.hash function
// into a promise-based function
const hash = bluebird.promisify(bcrypt.hash)
const saltRounds = 10

exports.get = req => new Promise((resolve, reject) => {
  const redis = req.server.app.redis

  if (req.params.id) { // get user with id
    if (
      req.auth.credentials.role !== 'ADMIN' &&
      req.auth.credentials.user.uid !== req.params.id.toString()
    ) {
      return reject(error.create(403, 'Unauthorized'))
    }

    redis.hgetallAsync(`user:${req.params.id}`)
      .then(user => {
        if (!user) return reject(error.create(204, 'No content'))
        resolve(user)
      })
      .catch(err => reject(error.create(500, err.message)))
  } else { // get all users (it is paginated)
    if (req.auth.credentials.role !== 'ADMIN') {
      return reject(error.create(403, 'Unauthorized'))
    }

    // get first 20 elements if no page and limit are specified
    const page = req.query.page || 0
    const limit = req.query.limit || 20
    redis.lrangeAsync('users', page * (limit - 1), (page + 1) * (limit - 1))
      .then(ids => {
        if (!ids || !ids.length) {
          return reject(error.create(204, 'No content'))
        }

        const multi = redis.multi()
        ids.forEach(id => multi.hgetallAsync(`user:${id}`))
        multi.execAsync()
          .then(users => {
            if (!users) return reject(error.create(204, 'No content'))
            resolve(users)
          })
          .catch(err => reject(error.create(500, err.message)))
      })
      .catch(err => reject(error.create(500, err.message)))
  }
})

exports.create = req => new Promise((resolve, reject) => {
  const redis = req.server.app.redis
  const graph = req.server.app.graph

  redis.lindexAsync('users', -1) // get last user's id
    .then(id => {
      if (!id) id = 0

      redis.getAsync(`user:${req.payload.email}`)
        .then(user => {
          if (user) {
            return reject(error.create(403, 'User already exists'))
          }

          hash(req.payload.password, saltRounds) // hash plain text password
            .then(h => {
              const user = {
                email: req.payload.email,
                name: req.payload.name || '',
                uid: (parseInt(id) + 1).toString(),
                lastName: req.payload.lastName || '',
                hash: process.env.NODE_ENV === 'test' ? req.payload.password : h // don't hash password on testing env
              }

              const node = {
                name: req.payload.name || '',
                uid: (parseInt(id) + 1).toString(),
                lastName: req.payload.lastName || ''
              }

              const multi = redis.multi()
              const validUserType = getValidUserType(req.params.userType || 'USER')

              if (validUserType == null) {
                return reject(error.create(403, 'Invalid user type'))
              }

              // all redis operations required on user creation
              multi.rpush('users', user.uid)
              multi.hmset(`user:${user.uid}`, user)
              multi.set(`user:${user.email}`, user.uid)
              multi.set(`user:${user.uid}:role`, validUserType)

              Promise.all([
                multi.execAsync(),
                graph.saveAsync(node, validUserType)
              ])
                .then(() => resolve(user))
                .catch(err => reject(error.create(500, err.message)))
            })
            .catch(err => reject(error.create(500, err.message)))
        })
        .catch(err => reject(error.create(500, err.message)))
    })
    .catch(err => reject(error.create(500, err.message)))
})

exports.update = req => new Promise((resolve, reject) => {
  if (
    req.auth.credentials.role !== 'ADMIN' &&
    req.auth.credentials.user.uid !== req.params.id.toString()
  ) {
    return reject(error.create(403, 'Unauthorized'))
  }

  const redis = req.server.app.redis
  const graph = req.server.app.graph

  Promise.all([
    redis.hgetallAsync(`user:${req.params.id}`),
    graph.findAsync({uid: req.params.id.toString()})
  ])
    .then(results => {
      const user = results[0]
      const nodes = results[1]

      if (!user || !nodes[0]) {
        return reject(error.create(204, 'User not found'))
      }

      // will be saved to redis
      const newUser = Object.assign({}, user, {
        name: req.payload.name || user.name,
        email: req.payload.email || user.email,
        lastName: req.payload.lastName || user.lastName
      })

      // will be saved to graphene
      const newNode = {
        name: req.payload.name || user.name,
        lastName: req.payload.lastName || user.lastName
      }

      Promise.all([
        redis.hmsetAsync(`user:${user.uid}`, newUser),
        graph.saveAsync(Object.assign({}, nodes[0], newNode))
      ])
        .then(results => resolve(newUser))
        .catch(err => reject(error.create(500, err.message)))
    })
    .catch(err => reject(error.create(500, err.message)))
})

exports.delete = req => new Promise((resolve, reject) => {
  if (
    req.auth.credentials.role !== 'ADMIN' &&
    req.auth.credentials.user.uid !== req.params.id.toString()
  ) {
    return reject(error.create(403, 'Unauthorized'))
  }

  const redis = req.server.app.redis
  const graph = req.server.app.graph

  Promise.all([
    redis.hgetallAsync(`user:${req.params.id}`),
    graph.findAsync({uid: req.params.id.toString()})
  ])
    .then(results => {
      const user = results[0]
      const nodes = results[1]

      if (!user || !nodes[0]) {
        return reject(error.create(204, 'User not found'))
      }

      const multi = redis.multi()
      redis.del(`user:${user.email}`)
      redis.del(`user:${user.uid}`)
      redis.lrem('users', 1, user.uid)

      Promise.all([
        multi.execAsync(),
        graph.delete(nodes[0])
      ])
        .then(res => resolve(user))
        .catch(err => reject(error.create(500, err.message)))
    })
    .catch(err => reject(error.create(500, err.message)))
})
