const error = require('../shared/error')
const catchUnknownErrors = require('./utils').catchUnknownErrors

exports.create = req => new Promise((resolve, reject) => {
  const offers = req.server.app.mongo.collection('offers')
  offers.insertOne(Object.assign({}, req.body, {status: 'pending'}), (err, res) => {
    if (err) return catchUnknownErrors(reject, err)
    resolve({id: res.insertedId})
  })
})

exports.get = req => new Promise((resolve, reject) => {
  const offers = req.server.app.mongo.collection('offers')
  const userId = req.auth.credentials.user.id

  if (req.params && req.params.id) {
    offers.findOne({_id: req.params.id}, (err, doc) => {
      if (err) return catchUnknownErrors(reject, err)
      resolve(doc)
    })
  } else {
    offers.find({
      $or: [
        {hostId: userId},
        {bandId: userId}
      ]
    }).toArray((err, docs) => {
      if (err) return catchUnknownErrors(reject, err)
      resolve(docs)
    })
  }
})

exports.getInactive = req => new Promise((resolve, reject) => {
  const rejectedOffers = req.server.app.mongo.collection('offers:inactive')
  const userId = req.auth.credentials.user.id
  rejectedOffers.find({
    $or: [
      {hostId: userId},
      {bandId: userId}
    ]
  }).toArray((err, docs) => {
    if (err) return catchUnknownErrors(reject, err)
    resolve(docs)
  })
})

exports.accept = req => new Promise((resolve, reject) => {
  const offers = req.server.app.mongo.collection('offers')
  offers.findOneAndUpdate({_id: req.params.id}, {$set: {status: 'accepted'}}, (err, res) => {
    if (err) return catchUnknownErrors(reject, err)
    if (!res.value) return reject(error.RESOURCE_NOT_FOUND)
    res.value.status = 'accepted'
    resolve(res.value)
  })
})

exports.reject = req => new Promise((resolve, reject) => {
  const acceptedOffers = req.server.app.mongo.collection('offers')
  const rejectedOffers = req.server.app.mongo.collection('offers:inactive')
  acceptedOffers.findOne({_id: req.params.id}, (err, doc) => { // find offer
    if (err) return catchUnknownErrors(reject, err)
    if (!doc) return reject(error.RESOURCE_NOT_FOUND)
    rejectedOffers.insertOne(doc, (err, res) => { // add to offers:inactive collection
      if (err) return catchUnknownErrors(reject, err)
      acceptedOffers.deleteOne({_id: req.params.id}, (err, res) => { // remove from offers collection
        if (err) return catchUnknownErrors(reject, err)
        resolve(res)
      })
    })
  })
})
