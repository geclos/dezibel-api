const config = require('../../src/config')
const bluebird = require('bluebird')
const redis = require('redis')

// redis client, off the shelf, works with callbacks
// this will make it work with promises :)
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

exports.createRedisClient = () => {
  const client = redis.createClient(config.redis.port, config.redis.host)
  client.on('error', err => { throw new Error('Error ' + err) })
  return client
}
