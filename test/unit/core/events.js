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
  description: 'Lorem ipsum dolor sit amet, consectetur adipisicin'
}

let db
test.before(t => {
  return mongo.MongoClient.connect('mongodb://localhost:27017/local')
    .then(database => {
      db = database
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
    .then(ev => {
      id = ev._id
      t.pass(Object.assign({}, event, {_id: id}))
    })
    .catch(err => t.fail(err.message))
})

test.serial('should fail to CREATE event that already exists', t => {
  req.body = event
  return events.create(req)
    .then(ev => t.fail())
    .catch(() => t.pass())
})

test.serial('GET event', t => {
  req.params = {id: id}
  return events.get(req)
    .then(ev => t.deepEqual(ev, event))
    .catch(err => t.fail(err.message))
})

test.serial('should fail to GET missing event', t => {
  req.params = {id: 2}
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
    .then(ev => {
      delete req.body.id
      t.deepEqual(ev, req.body)
    })
    .catch(err => t.fail(err.message))
})

test.serial('should faild to UPDATE missing event', t => {
  req.params.id = 2
  req.body = event
  return events.update(req)
    .then(ev => t.fail())
    .catch(() => t.pass())
})

test.serial('DELETE event', t => {
  req.params = {id: id}
  return events.delete(req)
    .then(ev => {
      delete ev._id
      delete event._id
      event.title = 'foo'
      t.deepEqual(ev, event)
    })
    .catch(err => t.fail(err.error))
})

test.serial('should fail to DELETE missing event', t => {
  req.params = {id: 2}
  return events.delete(req)
    .then(ev => t.fail())
    .catch(() => t.pass())
})
