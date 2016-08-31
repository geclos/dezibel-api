const test = require('ava')
const error = require('../../../src/utils/error')

const errorObject = {
  message: 'foo',
  statusCode: 401,
  error: 'Unauthorized'
}

test('should create error object', t => {
  const result = error.create(errorObject.statusCode, errorObject.message)
  t.deepEqual(errorObject, result)
})

test('should validate an error object', t => {
  const expected = true
  const result = error.isValidError(errorObject)
  t.deepEqual(expected, result)
})

test('should generate a valid error object from an Error instance', t => {
  const fooError = new Error('message')

  const expected = {
    statusCode: 500,
    message: 'message',
    error: 'Internal server error'
  }

  const result = error.unknown(fooError)
  t.deepEqual(expected, result)
})
