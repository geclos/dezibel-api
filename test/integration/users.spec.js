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
  let token

  before(done => {
    seed()
      .then(() => {
        server.inject({
          method: 'POST',
          url: '/login',
          payload: {
            email: 'foo@bar.com',
            password: '123456'
          }
        }, response => {
          token = response.result.token
          done()
        })
      })
      .catch(err => { throw err })
  })

  it('should create user', done => {
    server.inject({
      method: 'POST',
      headers: { Authorization: `bearer ${token}` },
      url: '/users',
      payload: {
        email: 'bar@foo.com',
        password: '123456'
      }
    }, response => {
      expect(response.statusCode).to.equal(200)
      done()
    })
  })

  it('should get user', done => {
    server.inject({
      method: 'GET',
      headers: { Authorization: `bearer ${token}` },
      url: '/users/1'
    }, response => {
      expect(response.statusCode).to.equal(200)
      expect(response.result.email).to.equal('foo@bar.com')
      done()
    })
  })

  it('should fail to get user', done => {
    server.inject({
      method: 'GET',
      headers: { Authorization: `bearer ${token}` },
      url: '/users/2'
    }, response => {
      expect(response.statusCode).to.equal(403)
      done()
    })
  })

  it('should update user', done => {
    server.inject({
      method: 'PUT',
      headers: { Authorization: `bearer ${token}` },
      url: '/users/1',
      payload: { lastName: 'xyc' }
    }, response => {
      expect(response.statusCode).to.equal(200)
      expect(response.result.lastName).to.equal('xyc')
      done()
    })
  })

  it('should fail to update user', done => {
    server.inject({
      method: 'PUT',
      headers: { Authorization: `bearer ${token}` },
      url: '/users/2',
      payload: { lastName: 'xyc' }
    }, response => {
      expect(response.statusCode).to.equal(403)
      done()
    })
  })

  it('should fail to delete user', done => {
    server.inject({
      method: 'DELETE',
      headers: { Authorization: `bearer ${token}` },
      url: '/users/2'
    }, response => {
      expect(response.statusCode).to.equal(403)
      done()
    })
  })

  it('should delete user', done => {
    server.inject({
      method: 'DELETE',
      headers: { Authorization: `bearer ${token}` },
      url: '/users/1'
    }, response => {
      expect(response.statusCode).to.equal(200)
      done()
    })
  })
})
