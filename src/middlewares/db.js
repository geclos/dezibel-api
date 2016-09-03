
const redis = require('redis')
const bluebird = require('bluebird')
const MongoClient = require('mongodb').MongoClient

const REDIS_PORT = process.env.REDIS_PORT
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_AUTH = process.env.REDIS_AUTH

const MONGO_PORT = process.env.MONGO_PORT
const MONGO_HOST = process.env.MONGO_HOST
const MONGO_DATABASE = process.env.MONGO_DATABASE

const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`

// redis client, off the shelf, works with callbacks
// this will make it work with promises :)
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

exports.register = (server, options, next) => {
  const client = redis.createClient(REDIS_PORT, REDIS_HOST)
  if (REDIS_AUTH) client.auth(REDIS_AUTH)

  client.on('error', err => server.error('Error ' + err))

  MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) throw err

    // datbases will be now accesible from any endpoint
    server.app.mongo = db
    server.app.redis = client
    next()
  })
}

exports.register.attributes = {
  name: 'redis'
}
