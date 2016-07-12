const models = require('../models')

module.exports = [{
  method: 'GET',
  path: '/foo',
  config: {
    handler: (req, reply) => reply('foo').code(200),
    description: 'foo',
    auth: 'bearer',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': models.response.defaultSuccess,
          '401': models.response.unauthorized
        }
      }
    },
    validate: {
      headers: models.headers.authorization
    }
  }
}]
