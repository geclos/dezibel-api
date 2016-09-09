const error = require('../shared/error')
const catchUnknownErrors = require('./utils').catchUnknownErrors

exports.get = req => new Promise((resolve, reject) => {
  const events = req.server.app.mongo.collection('events')
  const userId = req.auth.credentials.user.id

  if (req.params.id) {
    events.findOne({_id: req.params.id, hostedBy: userId})
      .then(doc => {
        if (!doc) return reject(error.RESOURCE_NOT_FOUND)
        resolve(doc)
      })
      .catch(catchUnknownErrors.bind(null, reject))
  } else {
    events.find({}).toArray()
      .then(docs => {
        if (!docs) return reject(error.RESOURCE_NOT_FOUND)
        resolve(docs)
      })
      .catch(catchUnknownErrors.bind(null, reject))
  }
})

exports.create = req => new Promise((resolve, reject) => {
  const events = req.server.app.mongo.collection('events')
  req.body.location.type = 'Point'
  events.insertOne(req.body)
    .then(res => resolve(Object.assign({}, req.body, {id: res.insertedId})))
    .catch(catchUnknownErrors.bind(null, reject))
})

exports.update = req => new Promise((resolve, reject) => {
  const events = req.server.app.mongo.collection('events')
  const userId = req.auth.credentials.user.id
  const _id = req.params.id

  events.updateOne({_id: _id, hostedBy: userId}, req.body)
    .then(res => {
      if (!res.result.n) return reject(error.RESOURCE_NOT_FOUND)
      resolve(req.body)
    })
    .catch(catchUnknownErrors.bind(null, reject))
})

exports.delete = req => new Promise((resolve, reject) => {
  const events = req.server.app.mongo.collection('events')
  const userId = req.auth.credentials.user.id

  events.findOne({_id: req.params.id, hostedBy: userId}, (err, doc) => {
    if (err) return catchUnknownErrors(reject, err)
    if (!doc) return reject(error.RESOURCE_NOT_FOUND)
    events.deleteOne({_id: req.params.id, hostedBy: userId}, (err, res) => {
      if (err) return catchUnknownErrors(reject, err)
      if (!res.result.n) return reject(error.RESOURCE_NOT_FOUND)
      resolve(doc)
    })
  })
})

exports.findNear = req => new Promise((resolve, reject) => {
  const events = req.server.app.mongo.collection('events')
  events.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: req.body.location.coordinates
        },
        $maxDistance: 500
      }
    }
  }).toArray((err, docs) => {
    if (err) return catchUnknownErrors(reject, err)
    resolve(docs)
  })
})
