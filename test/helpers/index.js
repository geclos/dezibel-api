const bluebird = require('bluebird')
const redis = require('fakeredis')

// redis client, off the shelf, works with callbacks
// this will make it work with promises :)
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

exports.createRedisClient = () => redis
