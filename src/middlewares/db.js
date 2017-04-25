
const redis = require('redis')
const bluebird = require('bluebird')

const REDIS_PORT = process.env.REDIS_PORT
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_AUTH = process.env.REDIS_AUTH

// redis client, off the shelf, works with callbacks
// this will make it work with promises :)
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

exports.register = (server, options, next) => {
  const client = redis.createClient(REDIS_PORT, REDIS_HOST)

  if (REDIS_AUTH) client.auth(REDIS_AUTH)

  client.on('error', err => server.error('Error ' + err))
  server.app.redis = client
  next()
}

exports.register.attributes = {
  name: 'db'
}
