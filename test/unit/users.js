const createRedisClient = require('../helpers').createRedisClient
const users = require('../../src/core').users
const auth = require('../../src/core').auth
const test = require('ava')

const mockUser = {
  id: '1',
  name: 'Gerard',
  lastName: 'Clos',
  hash: '12345678',
  token: 'helloworld',
  email: 'demo@dezibel.com'
}

let db
test.before(t => { db = createRedisClient()  })

test('should login user', t => {
  const req = {
    server: {app: {redis: db}},
    payload: { email: mockUser.email, password: '1234' }
  }

  return auth.login(req)
    .then(user => t.deepEqual(user, mockUser))
    .catch(err => t.fail(err.message))
})

test('should create user', t => {
  const req = {
    server: {app: {redis: db}},
    payload: {
      name: 'John',
      password: '123',
      lastName: 'Smith',
      email: 'create@dezibel.com'
    }
  }

  const expected = {
    id: 2,
    name: req.payload.name,
    email: req.payload.email,
    hash: req.payload.password,
    lastName: req.payload.lastName
  }

  return users.create(req)
    .then(u => t.deepEqual(u, expected))
    .catch(err => t.fail(err.message))
})

test('should get user', t => {
  const req = {
    server: {app: {redis: db}},
    params: {id: 1}
  }

  return users.get(req)
    .then(u => t.deepEqual(u, mockUser))
    .catch(err => t.fail(err.message))
})

test('should update user', t => {
  const req = {
    server: {app: {redis: db}},
    params: {id: 1},
    payload: Object.assign({}, mockUser, { name: 'changed!' })
  }

  return users.update(req)
    .then(u => t.deepEqual(u, req.payload))
    .catch(err => t.fail(err.message))
})

test('should delete user', t => {
  const req = {
    params: {id: 1},
    server: {app: {redis: db}}
  }

  return users.delete(req)
    .then(u => t.deepEqual(u, mockUser))
    .catch(err => t.fail(err.message))
})
