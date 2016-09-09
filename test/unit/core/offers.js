const test = require('ava')
const mongo = require('mongodb')
const offers = require('../../../src/core').offers

const offer = {
  band: 2,
  hostId: 1,
  price: 23.30,
  currency: 'EUR',
  timestamp: Date.now(),
  message: 'Hello, this is an awesome message from the host',
  event: {
    title: 'foo',
    location: { coordinates: [0, 0] },
    description: 'Best event ever to happen'
  }
}

const req = {
  params: {},
  server: {
    app: {}
  },
  auth: {
    credentials: {
      user: {
        id: 1
      }
    }
  }
}

let db // mongo database reference
let id = 0 // offer id

test.before(t => {
  return mongo.MongoClient.connect('mongodb://localhost:27017/local')
    .then(database => {
      db = database
      db.createCollection('offers')
      db.createCollection('offers:inactive')
      db.collection('offers').createIndex({location: '2dsphere'})
      req.server.app.mongo = db
    })
    .catch(err => { t.fail(err.message) })
})

test.after(t => {
  db.collection('offers').deleteMany({})
  db.collection('offers:inactive').deleteMany({})
  db.close()
})

test.serial('should create an offer', t => {
  req.body = offer
  return offers.create(req)
    .then(res => {
      id = res.id
      t.pass()
    })
    .catch(err => t.fail(err.message))
})

test.serial('should get all offers', t => {
  req.body = {}
  return offers.get(req)
    .then(res => t.is(res.length, 1))
    .catch(err => t.fail(err.message))
})

test.serial('should accept an offer', t => {
  req.body = {}
  req.params.id = id
  return offers.accept(req)
    .then(res => t.is(res.status, 'accepted'))
    .catch(err => t.fail(err.message))
})

test.serial('should reject an offer', t => {
  req.body = {}
  req.params.id = id
  return offers.reject(req)
    .then(res => t.pass())
    .catch(err => t.fail(err.message))
})

test.serial('should return empty array of offers cause there are none', t => {
  req.body = {}
  req.params = {}
  offers.get(req)
    .then(res => t.is(res.length, 0))
    .catch(err => t.fail(err.message))
})

test.serial('should get all inactive offers', t => {
  offers.getInactive(req)
    .then(res => t.is(res.length, 1))
    .catch(err => t.fail(err.message))
})
