const test = require('ava')
const isValidUser = require('../../../src/controllers/shared').isValidUser
const handlePromise = require('../../../src/controllers/shared').handlePromise

test('should return true when param id and user id are equal', t => {
  const req = {
    params: {id: 1},
    auth: {
      credentials: {
        user: {
          id: '1'
        }
      }
    }
  }

  t.truthy(isValidUser(req))
})

test('should return false when param id and user id are different', t => {
  const req = {
    params: {id: 2},
    auth: {
      credentials: {
        user: {
          id: '1'
        }
      }
    }
  }

  t.falsy(isValidUser(req))
})

test('should return a promise', t => {
  const promise = () => new Promise(() => {})
  const req = {}
  const reply = {}

  t.truthy(handlePromise(req, reply, promise) instanceof Promise)
})
