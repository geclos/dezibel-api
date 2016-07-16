const Joi = require('joi')
const models = require('../models')
const auth = require('../core').auth

module.exports = [{
  method: 'POST',
  path: '/login',
  config: {
    handler: auth.login,
    description: 'Login to dezibel API',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            'description': 'Success',
            'schema': models.user
          },
          '401': models.response.unauthorized
        }
      }
    },
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required().description('user email'),
        password: Joi.string().alphanum().min(8).max(30).required().description('user password')
      }).required()
    }
  }
}]
