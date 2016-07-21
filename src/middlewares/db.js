const redis = require('redis')
const seraph = require('seraph')
const bluebird = require('bluebird')

const GRAPH_HOST = process.env.GRAPH_HOST
const GRAPH_USER = process.env.GRAPH_USER
const GRAPH_PASSWORD = process.env.GRAPH_PASSWORD

const REDIS_PORT = process.env.REDIS_PORT
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_AUTH = process.env.REDIS_AUTH

// redis client, off the shelf, works with callbacks
// this will make it work with promises :)
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

// same than before with graphdb client
bluebird.promisifyAll(seraph.prototype)

exports.register = (server, options, next) => {
  // register redis
  const client = redis.createClient(REDIS_PORT, REDIS_HOST)
  client.on('error', err => server.error('Error ' + err))
  if (REDIS_AUTH) client.auth(REDIS_AUTH)
  server.app.redis = client

  // register graph db
  server.app.graph = seraph({
    user: GRAPH_USER,
    server: GRAPH_HOST,
    pass: GRAPH_PASSWORD
  })

  next()
}

exports.register.attributes = {
  name: 'redis'
}
