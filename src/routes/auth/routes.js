const Joi = require('joi')
const models = require('../../models')
const auth = require('../../controllers').auth

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
            'schema': Joi.object({
              name: Joi.string(),
              lastName: Joi.string(),
              id: Joi.number().required(),
              hash: Joi.string().required(),
              token: Joi.string().required(),
              email: Joi.string().email().required()
            })
          },
          '401': {
            description: 'Unauthorized',
            schema: models.error
          },
          '500': {
            description: 'Runtime Error',
            schema: models.error
          }
        }
      }
    },
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required().description('user email'),
        password: Joi.string().alphanum().min(6).max(30).required().description('user password')
      }).required()
    }
  }
}, {
  method: ['GET', 'POST'],
  path: '/oauth/login',
  config: {
    auth: 'facebook',
    handler: auth.loginWithOauth,
    description: 'Login to dezibel with oauth strategy'
  }
}]
