const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()
const seed = require('../index')
const server = require('../../src/index')

// BDD
const describe = lab.describe
const it = lab.it
const before = lab.before
const expect = Code.expect

describe('/users', () => {
  before(done => {
    seed()
      .then(done)
      .catch(err => { throw err })
  })

  it('should fail to login user', done => {
    server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'foo@bar.com',
        password: '123457'
      }
    }, response => {
      expect(response.statusCode).to.equal(401)
      done()
    })
  })

  it('should login user', done => {
    server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'foo@bar.com',
        password: '123456'
      }
    }, response => {
      expect(response.statusCode).to.equal(200)
      done()
    })
  })
})
