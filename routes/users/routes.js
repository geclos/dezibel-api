const Joi = require('joi')
const models = require('../../models')

const unauthorized = {
  description: 'Unauthorized',
  schema: models.error
}

module.exports = [{
  path: '/{id?}',
  method: 'GET',
  handler: (req, reply) => {
    // TODO: get users...
    reply({ results: [], errors: [] }) // to be removed...
  },
  config: {
    description: 'get user',
    auth: 'bearer',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Success',
            schema: Joi.object({
              results: Joi.array(models.user),
              errors: Joi.array(models.error)
            })
          },
          '401': unauthorized
        }
      }
    },
    validate: {
      headers: models.headers,
      params: {
        id: Joi.string().description('user id')
      }
    }
  }
}, {
  path: '/',
  method: 'POST',
  handler: (req, reply) => {
    // TODO: get users...
    reply({
      results: [],
      errors: []
    }) // to be removed...
  },
  config: {
    description: 'post new user',
    auth: 'bearer',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            description: 'Success',
            schema: models.user
          },
          '401': unauthorized
        }
      }
    },
    validate: {
      headers: models.headers,
      payload: models.user
    }
  }
}]
