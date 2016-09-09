const test = require('ava')
const mongo = require('mongodb')
const events = require('../../../src/core').events

const req = {
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

const event = {
  hostedBy: 1,
  bands: [23, 25],
  title: 'Super event',
  timestamp: Date.now(),
  location: { coordinates: [10, 10] },
  description: 'Lorem ipsum dolor sit amet, consectetur adipisicin'
}

let db
test.before(t => {
  return mongo.MongoClient.connect('mongodb://localhost:27017/local')
    .then(database => {
      db = database
      db.createCollection('events')
      req.server.app.mongo = db
    })
    .catch(err => { t.fail(err.message) })
})

test.after(t => {
  db.collection('events').deleteMany({})
  db.close()
})

let id = 0

test.serial('CREATE event', t => {
  req.body = event
  return events.create(req)
    .then(res => {
      id = res.id
      t.deepEqual(res, Object.assign({}, event, {id: res.id}))
    })
    .catch(err => t.fail(err.message))
})

test.serial('GET event', t => {
  req.body = {}
  req.params = {id: id}
  return events.get(req)
    .then(ev => t.pass())
    .catch(err => t.fail(err.message))
})

test.serial('should fail to GET missing event', t => {
  req.params.id = 2
  return events.get(req)
    .then(ev => t.fail())
    .catch(() => t.pass())
})

test.serial('GET events', t => {
  req.params = {}
  return events.get(req)
    .then(ev => t.truthy(ev instanceof Array))
    .catch(err => t.fail(err.message))
})

test.serial('UPDATE event', t => {
  req.params.id = id
  req.body = Object.assign({}, event, { title: 'foo' })
  return events.update(req)
    .then(ev => t.pass())
    .catch(err => t.fail(err.message))
})

test.serial('should faild to UPDATE missing event', t => {
  req.params.id = 2
  req.body = event
  return events.update(req)
    .then(ev => t.fail())
    .catch(() => t.pass())
})

test.serial('should find near elemens', t => {
  req.body = { location: {coordinates: [10.000001, 10.0000001]} }
  return events.findNear(req)
    .then(e => t.is(e.length, 1))
    .catch(err => t.fail(err.message))
})

test.serial('DELETE event', t => {
  req.params = {id: id}
  return events.delete(req)
    .then(ev => t.pass())
    .catch(err => t.fail(err.error))
})

test.serial('should fail to DELETE missing event', t => {
  req.params = {id: 2}
  return events.delete(req)
    .then(ev => t.fail())
    .catch(() => t.pass())
})
