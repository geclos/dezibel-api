const Joi = require('joi')

exports.register = (server, options, next) => {
  const controllers = server.plugins['controllers'].controllers
  const models = server.plugins['models'].models

  server.select('api').route([{
    method: 'POST',
    path: '/login',
    config: {
      handler: controllers.auth.login,
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
      handler: controllers.auth.loginWithOauth,
      description: 'Login to dezibel with oauth strategy'
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'routes:auth'
}
