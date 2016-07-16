const redis = require('redis')
const config = require('../config')
const bluebird = require('bluebird')

// redis client, off the shelf, works with callbacks
// this will make it work with promises :)
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

exports.register = (server, options, next) => {
  const client = redis.createClient(config.redis.port, config.redis.host, config.redis.options)
  client.on('error', err => server.error('Error ' + err))
  client.auth(config.redis.password)

  server.app.redis = client // it will be now accesible on any endpoint
  next()
}

exports.register.attributes = {
  name: 'redis'
}
