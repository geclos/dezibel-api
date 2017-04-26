const Code = require('code')
const Lab = require("lab")
const lab = exports.lab = Lab.script()
const server = require("../../src/index")

// BDD
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;

describe('/users', () => {
  let token

  const user = {
    "name": "Foo",
    "lastName": "bar",
    "email": "foo@bar.com",
    "password": "123456"
  }

  before(done => {
    server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        "name": "Foo",
        "lastName": "bar",
        "email": "foo@bar.com",
        "password": "123456"
      }
    }, response => {
      server.inject({
        method: 'POST',
        url: '/login',
        payload: {
          "email": "foo@bar.com",
          "password": "123456"
        }
      }, response => {
        token = response.payload.token
      })
    })
  })

  it('should create user', done => {
    server.inject({
      method: 'POST',
      header: {Authorization: `bearer ${token}`},
      url: '/users',
      payload: user
    }, response => {
      expect(response.statusCode).to.equal(200)
      done()
    })
  })

  it('should get user', done => {
    server.inject({
      method: 'GET',
      header: {Authorization: `bearer ${token}`},
      url: '/users/1'
    }, response => {
      expect(response.statusCode).to.equal(200)
      expect(response.payload).to.equal(user)
      done()
    })
  })

  it('should update user', done => {
    server.inject({
      method: 'PUT',
      header: {Authorization: `bearer ${token}`},
      url: '/users/1',
      payload: { lastName: "xyc" }
    }, response => {
      expect(response.statusCode).to.equal(200)
      expect(response.payload).to.equal(Object.assign({}, user, { lastName: "xyc" }))
      done()
    })
  })
})
