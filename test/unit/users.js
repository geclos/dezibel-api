const createRedisClient = require('../helpers').createRedisClient
const users = require('../../src/core').users
const auth = require('../../src/core').auth
const sinon = require('sinon')
const test = require('ava')

const mockUser = {
  id: '1',
  name: 'Gerard',
  lastName: 'Clos',
  hash: '12345678',
  email: 'demo@dezibel.com'
}

let redis
test.before(t => { redis = createRedisClient() })

test('should create user', t => {
  const db = redis.createClient()
  return createUser(db, t)
    .then(u => t.deepEqual(u, mockUser))
    .catch(err => t.fail(err.message))
})

test('create user should fail', t => {
  const db = redis.createClient()
  const req = {
    server: {
      app: {
        redis: db,
        secret: 'password'
      }
    },
    payload: {}
  }

  return users.create(req)
    .then(res => t.fail())
    .catch(err => t.pass())
})

test('should login user', t => {
  const db = redis.createClient()
  return createUser(db, t)
    .then(u => {
      const req = {
        server: {
          app: {
            redis: db,
            secret: 'password'
          }
        },
        payload: { email: mockUser.email, password: mockUser.hash }
      }

      return auth.login(req)
        .then(user => t.deepEqual(user, mockUser))
        .catch(err => t.fail(err.message))
    })
    .catch(err => t.fail(err.message))
})

test('login should fail', t => {
  const db = redis.createClient()
  return createUser(db, t)
    .then(u => {
      const req = {
        server: {
          app: {
            redis: db,
            secret: 'password'
          }
        },
        payload: {}
      }

      return auth.login(req)
        .then(user => t.fail())
        .catch(err => t.is(401, err.statusCode))
    })
    .catch(err => t.fail(err.message))
})

test('should login user with oauth', t => {
  const db = redis.createClient()
  return createUser(db, t)
    .then(u => {
      const req = {
        server: {
          app: {
            redis: db,
            secret: 'password'
          }
        },
        auth: {
          isAuthenticated: true,
          credentials: {
            profile: {
              email: mockUser.email
            }
          }
        }
      }

      return auth.loginWithOauth(req)
        .then(user => t.deepEqual(user, mockUser))
        .catch(err => t.fail(err.message))
    })
    .catch(err => t.fail(err.message))
})

test('login with oauth should fail', t => {
  const db = redis.createClient()
  return createUser(db, t)
    .then(u => {
      const req = {
        server: {
          app: {
            redis: db,
            secret: 'password'
          }
        },
        auth: {}
      }

      return auth.loginWithOauth(req)
        .then(user => t.fail())
        .catch(err => t.is(401, err.statusCode))
    })
    .catch(err => t.fail(err.message))
})

test('should get user', t => {
  const db = redis.createClient()
  return createUser(db, t)
    .then(u => {
      const req = {
        server: {
          app: {
            redis: db,
            secret: 'password'
          }
        },
        params: {id: 1}
      }

      return users.get(req)
        .then(u => t.deepEqual(u, mockUser))
        .catch(err => t.fail(err.message))
    })
    .catch(err => t.fail(err.message))
})

test('should fail on getting user', t => {
  const db = redis.createClient()
  return createUser(db, t)
    .then(u => {
      const req = {
        server: {
          app: {
            redis: db,
            secret: 'password'
          }
        },
        params: {id: 2} // id of non existing user..
      }

      return users.get(req)
        .then(u => t.fail())
        .catch(err => t.is(204, err.statusCode))
    })
    .catch(err => t.fail(err.message))
})

test('should get all users', t => {
  const db = redis.createClient()
  return createUser(db, t)
    .then(u => {
      const req = {
        server: {
          app: {
            redis: db,
            secret: 'password'
          }
        },
        params: {},
        query: {}
      }

      return users.get(req)
        .then(u => t.deepEqual(u, [mockUser]))
        .catch(err => t.fail(err.message))
    })
    .catch(err => t.fail(err.message))
})

test('should fail on getting all users', t => {
  const db = redis.createClient()
  const req = {
    server: {
      app: {
        redis: db,
        secret: 'password'
      }
    },
    params: {},
    query: {}
  }

  return users.get(req)
    .then(u => t.fail(u))
    .catch(err => t.is(204, err.statusCode))
})

test('should update user', t => {
  const db = redis.createClient()
  return createUser(db, t)
    .then(u => {
      const req = {
        server: {
          app: {
            redis: db,
            secret: 'password'
          }
        },
        params: {id: 1},
        payload: Object.assign({}, mockUser, { name: 'changed!' })
      }

      return users.update(req)
        .then(u => t.deepEqual(u, req.payload))
        .catch(err => t.fail(err.message))
    })
    .catch(err => t.fail(err.message))
})

test('should fail on updating user', t => {
  const db = redis.createClient()
  return createUser(db, t)
    .then(u => {
      const req = {
        server: {
          app: {
            redis: db,
            secret: 'password'
          }
        },
        params: {id: 2}, // non existing user...
        payload: Object.assign({}, mockUser, { name: 'changed!' })
      }

      return users.update(req)
        .then(u => t.fail(u))
        .catch(err => t.is(204, err.statusCode))
    })
    .catch(err => t.fail(err.message))
})

test('should delete user', t => {
  const db = redis.createClient()
  return createUser(db, t)
    .then(u => {
      const req = {
        params: {id: 1},
        server: {
          app: {
            redis: db,
            secret: 'password'
          }
        }
      }

      return users.delete(req)
        .then(u => t.deepEqual(u, mockUser))
        .catch(err => t.fail(err.message))
    })
    .catch(err => t.fail(err.message))
})

test('should fail on deleting user', t => {
  const db = redis.createClient()
  return createUser(db, t)
    .then(u => {
      const req = {
        params: {id: 2},
        server: {
          app: {
            redis: db,
            secret: 'password'
          }
        }
      }

      return users.delete(req)
        .then(u => t.fail())
        .catch(err => t.is(204, err.statusCode))
    })
    .catch(err => t.fail(err.message))
})

function createUser (db, t) {
  const req = {
    server: {
      app: {
        redis: db,
        secret: 'password'
      }
    },
    payload: Object.assign({}, mockUser, {
      password: mockUser.hash,
      hash: undefined
    })
  }

  return users.create(req)
}
