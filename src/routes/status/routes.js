const Joi = require('joi')
const models = require('../../models')
const status = require('../../controllers').status

module.exports = [{
  method: 'GET',
  path: '/status',
  config: {
    handler: status.get,
    description: 'Get status of server and all associated resources, mainly databases.',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            'description': 'Success',
            'schema': Joi.string().required().description('\'ok\'')
          },
          '500': {
            description: 'Runtime Error',
            schema: models.error
          }
        }
      }
    }
  }
}]
