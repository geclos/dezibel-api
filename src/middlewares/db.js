const redis = require('redis')
const Seraph = require('seraph')
const bluebird = require('bluebird')

const REDIS_PORT = process.env.REDIS_PORT
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_AUTH = process.env.REDIS_AUTH
const GRAPHENE_HOST = process.env.GRAPHENE_HOST
const GRAPHENE_PORT = process.env.GRAPHENE_PORT
const GRAPHENE_USERNAME = process.env.GRAPHENE_USERNAME
const GRAPHENE_PASSWORD = process.env.GRAPHENE_PASSWORD

// redis client, off the shelf, works with callbacks
// this will make it work with promises :)
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

exports.register = (server, options, next) => {
  // Connection to redis db
  const client = redis.createClient(REDIS_PORT, REDIS_HOST)
  client.on('error', err => server.error('Error ' + err))
  if (REDIS_AUTH) client.auth(REDIS_AUTH)

  // Connection to graph db
  const graph = bluebird.promisifyAll(Seraph({
    user: GRAPHENE_USERNAME,
    pass: GRAPHENE_PASSWORD,
    server: `http://${GRAPHENE_HOST}:${GRAPHENE_PORT}`
  }))

  server.app.graph = graph // graphdb will be now accesible from any endpoint
  server.app.redis = client // redisdb will be now accesible from any endpoint
  next()
}

exports.register.attributes = {
  name: 'db'
}
