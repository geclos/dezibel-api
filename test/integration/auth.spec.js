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

describe('/auth', () => {
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
      done()
    })
  })

  it('should fail to login', done => {
    server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: "foo@bar.com",
        password: "1234"
      }
    }, response => {
      expect(response.statusCode).to.equal(400)
      done()
    })
  })

  it('should login', done => {
    server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: "foo@bar.com",
        password: "123456"
      }
    }, response => {
      expect(response.statusCode).to.equal(200)
      done()
    })
  })
})
