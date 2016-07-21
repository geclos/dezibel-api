const error = require('../utils/error')

exports.get = req => new Promise((resolve, reject) => {
  const redis = req.server.app.redis
  const graph = req.server.app.graph

  const query = [
    'MATCH (n)',
    'RETURN n'
  ].join('\n')

  Promise.all([
    redis.infoAsync(),
    graph.queryAsync(query)
  ])
    .then(results => resolve('ok'))
    .catch(err => reject(error.create(500, err.message)))
})
