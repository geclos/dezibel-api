const models = require('../../models')

module.exports = [{
  path: '/token',
  method: 'GET',
  handler: (req, reply) => reply({token: req.auth.credentials.token}).code(200),
  config: {
    description: 'foo',
    auth: 'bearer',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': models.response.defaultJSON,
          '401': models.response.unauthorized
        }
      }
    },
    validate: {
      headers: models.headers.authorization
    }
  }
}]
