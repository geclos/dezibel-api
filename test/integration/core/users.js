const test = require('ava')
const redis = require('fakeredis')
const bluebird = require('bluebird')
const auth = require('../../../src/core').auth
const users = require('../../../src/core').users

const mockUser = {
  id: '1',
  name: 'Gerard',
  lastName: 'Clos',
  password: '12345678',
  email: 'demo@dezibel.com'
}

// redis client, off the shelf, works with callbacks
// this will make it work with promises :)
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const db = redis.createClient()
const baseReq = {
  server: {
    app: {
      redis: db,
      secret: 'password'
    }
  },
  params: {},
  query: {}
}

test.serial('should create user', t => {
  const req = Object.assign({}, baseReq, {
    payload: mockUser
  })

  return users.create(req)
    .then(u => t.truthy(compareUsers(t, u, mockUser)))
    .catch(err => t.fail(err.message))
})

test.serial('should fail to create cause user already exists', t => {
  const req = Object.assign({}, baseReq, {
    payload: mockUser
  })

  return users.create(req)
    .then(u => t.fail())
    .catch(err => t.is(err.statusCode, 403))
})

test.serial('should login user', t => {
  const req = Object.assign({}, baseReq, {
    payload: { email: mockUser.email, password: mockUser.password }
  })

  return auth.login(req)
    .then(u => t.truthy(compareUsers(t, u, mockUser)))
    .catch(err => t.fail(err.message))
})

test.serial('should fail to login user cause unexisting email/user', t => {
  const req = Object.assign({}, baseReq, {
    payload: { email: 'foo@foo.com', password: mockUser.email }
  })

  return auth.login(req)
    .then(u => t.fail())
    .catch(err => t.is(err.statusCode, 401))
})

test.serial('should fail to login user cause wrong password', t => {
  const req = Object.assign({}, baseReq, {
    payload: { email: mockUser.email, password: 'foo' }
  })

  return auth.login(req)
    .then(u => t.fail())
    .catch(err => t.is(err.statusCode, 401))
})

test.serial('should login user with oauth', t => {
  const req = Object.assign({}, baseReq, {
    auth: {
      isAuthenticated: true,
      credentials: {
        profile: {
          email: mockUser.email
        }
      }
    }
  })

  return auth.loginWithOauth(req)
    .then(u => t.truthy(compareUsers(t, u, mockUser)))
    .catch(err => t.fail(err.message))
})

test.serial('should fail to login user with oauth cause is not authenticated', t => {
  const req = Object.assign({}, baseReq, {
    auth: {
      isAuthenticated: false,
      credentials: {
        profile: {
          email: mockUser.email
        }
      }
    }
  })

  return auth.loginWithOauth(req)
    .then(u => t.fail())
    .catch(err => t.is(err.statusCode, 401))
})

test.serial('should get user', t => {
  const req = Object.assign({}, baseReq, {
    auth: {
      credentials: {
        user: {id: 1}
      }
    },
    params: {id: 1}
  })

  return users.get(req)
    .then(u => t.truthy(compareUsers(t, u, mockUser)))
    .catch(err => t.fail(err.message))
})

test.serial('should fail to get unexisting user', t => {
  const req = Object.assign({}, baseReq, {
    auth: {
      credentials: {
        user: {id: 1}
      }
    },
    params: {id: 2}
  })

  return users.get(req)
    .then(u => t.fail())
    .catch(err => t.pass(err.statusCode), 403)
})

test.serial('should update user', t => {
  const req = Object.assign({}, baseReq, {
    auth: {
      credentials: {
        user: {id: 1}
      }
    },
    params: {id: 1},
    payload: Object.assign({}, mockUser, { name: 'changed!' })
  })

  return users.update(req)
    .then(u => t.truthy(compareUsers(t, u, req.payload)))
    .catch(err => t.fail(err.message))
})

test.serial('should fail to update unexisting user', t => {
  const req = Object.assign({}, baseReq, {
    auth: {
      credentials: {
        user: {id: 1}
      }
    },
    params: {id: 2}
  })

  return users.update(req)
    .then(u => t.fail())
    .catch(err => t.is(err.statusCode, 204))
})

test.serial('should fail to delete unexisting user', t => {
  const req = Object.assign({}, baseReq, {
    params: {id: 2},
    auth: {
      credentials: {
        user: {id: 1}
      }
    }
  })

  return users.delete(req)
    .then(u => t.fail())
    .catch(err => t.pass(err.statusCode, 204))
})

test.serial('should delete user', t => {
  const req = Object.assign({}, baseReq, {
    params: {id: 1},
    auth: {
      credentials: {
        user: {id: 1}
      }
    }
  })

  return users.delete(req)
    .then(u => t.truthy(compareUsers(t, u, Object.assign({}, mockUser, {name: 'changed!'}))))
    .catch(err => t.fail(err.message))
})

const compareUsers = (t, obj1, obj2) => {
  return (
    obj1.id === obj2.id &&
    obj1.name === obj2.name &&
    obj1.email === obj2.email &&
    obj1.lastName === obj2.lastName
  )
}
