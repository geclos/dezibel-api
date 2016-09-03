const test = require('ava')
const sinon = require('sinon')
const error = require('../../../src/utils/error')
const catchUnknownErrors = require('../../../src/core/utils').catchUnknownErrors

test('should reject with result of calling error.unknown()', t => {
  const spy = sinon.spy()
  sinon.spy(error, 'unknown')
  catchUnknownErrors(spy, new Error())
  t.truthy(spy.calledOnce)
  t.truthy(error.unknown.calledOnce)
})
