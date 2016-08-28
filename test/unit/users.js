const test = require('ava')
const Promise = require('bluebird')
const auth = require('../../src/core').auth
const users = require('../../src/core').users
const createRedisClient = require('../helpers').createRedisClient
const graph = Promise.promisifyAll(require('seraph')({
  server: 'http://localhost:7474',
  user: 'neo4j',
  pass: '1234'
}))

const mockUser = {
  uid: '1',
  name: 'Gerard',
  lastName: 'Clos',
  hash: '12345678',
  email: 'demo@dezibel.com'
}

const db = createRedisClient().createClient()

test.serial('should create user', t => {
  return createUser(db, t)
    .then(u => t.deepEqual(u, mockUser))
    .catch(err => t.fail(err.message))
})

test.serial('should login user', t => {
  const req = {
    server: {
      app: {
        redis: db,
        graph: graph,
        secret: 'password'
      }
    },
    payload: { email: mockUser.email, password: mockUser.hash }
  }

  return auth.login(req)
    .then(user => t.deepEqual(user, mockUser))
    .catch(err => t.fail(err.message))
})

test.serial('should login user with oauth', t => {
  const req = {
    server: {
      app: {
        redis: db,
        graph: graph,
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

test.serial('should get user', t => {
  const req = {
    server: {
      app: {
        redis: db,
        graph: graph,
        secret: 'password'
      }
    },
    auth: {
      credentials: {
        role: 'ADMIN'
      }
    },
    params: {id: 1}
  }

  return users.get(req)
    .then(u => t.deepEqual(u, mockUser))
    .catch(err => t.fail(err.message))
})

test.serial('should get all users', t => {
  const req = {
    server: {
      app: {
        redis: db,
        graph: graph,
        secret: 'password'
      }
    },
    auth: {
      credentials: {
        role: 'ADMIN'
      }
    },
    params: {},
    query: {}
  }

  return users.get(req)
    .then(u => t.deepEqual(u, [mockUser]))
    .catch(err => t.fail(err.message))
})

test.serial('should update user', t => {
  const req = {
    server: {
      app: {
        redis: db,
        graph: graph,
        secret: 'password'
      }
    },
    auth: {
      credentials: {
        role: 'ADMIN'
      }
    },
    params: {id: 1},
    payload: Object.assign({}, mockUser, { name: 'changed!' })
  }

  return users.update(req)
    .then(u => t.deepEqual(u, req.payload))
    .catch(err => t.fail(err.message))
})

test.serial('should delete user', t => {
  const req = {
    params: {id: 1},
    server: {
      app: {
        redis: db,
        graph: graph,
        secret: 'password'
      }
    },
    auth: {
      credentials: {
        role: 'ADMIN'
      }
    }
  }

  return users.delete(req)
    .then(u => t.deepEqual(u, Object.assign({}, mockUser, {name: 'changed!'})))
    .catch(err => t.fail(err.message))
})

function createUser (db, t) {
  const req = {
    server: {
      app: {
        redis: db,
        graph: graph,
        secret: 'password'
      }
    },
    params: {},
    payload: Object.assign({}, mockUser, {
      password: mockUser.hash,
      hash: undefined
    })
  }

  return users.create(req)
}
