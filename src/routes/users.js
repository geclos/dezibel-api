const Joi = require('joi')
const roles = require('../shared/constants').roles.slice(1)

exports.register = (server, options, next) => {
  const controllers = server.plugins['controllers'].controllers
  const models = server.plugins['models'].models

  server.select('api').route([{
    path: '/{id?}',
    method: 'GET',
    handler: controllers.users.get,
    config: {
      description: 'get user[s]',
      tags: ['api'],
      plugins: {
        'hapi-swagger': {
          responses: Object.assign({}, models.responses, {
            '200': {
              description: 'Success',
              schema: Joi.array().items(models.user)
            }
          })
        },
        hapiAuthorization: {
          role: 'ADMIN'
        }
      },
      validate: {
        headers: models.headers,
        query: {
          limit: Joi.number(),
          page: Joi.number()
        },
        params: {
          id: Joi.number().description('user id')
        }
      }
    }
  }, {
    path: '/{userType?}',
    method: 'POST',
    handler: controllers.users.create,
    config: {
      description: 'create new user',
      tags: ['api'],
      auth: false,
      plugins: {
        'hapi-swagger': {
          responses: Object.assign({}, models.responses, {
            '200': {
              description: 'Success',
              schema: models.user
            }
          })
        }
      },
      validate: {
        payload: Joi.object({
          name: Joi.string(),
          lastName: Joi.string(),
          email: Joi.string().email().required(),
          password: Joi.string().alphanum().min(6).max(30).required()
        }).required(),
        params: {
          userType: Joi.string().valid(roles).description('user type: \'user\', \'band\', \'venue\'. Defaults to \'user\'.')
        }
      }
    }
  }, {
    path: '/{id}',
    method: 'PUT',
    handler: controllers.users.update,
    config: {
      description: 'update user',
      tags: ['api'],
      plugins: {
        'hapi-swagger': {
          responses: Object.assign({}, models.responses, {
            '200': {
              description: 'Success',
              schema: models.user
            }
          })
        },
        'hapi-authorization': {
          role: 'ADMIN'
        }
      },
      validate: {
        headers: models.headers,
        params: {
          id: Joi.number().required().description('user id')
        },
        payload: Joi.object({
          name: Joi.string(),
          lastName: Joi.string(),
          email: Joi.string().email()
        }).required()
      }
    }
  }, {
    path: '/{id}',
    method: 'DELETE',
    handler: controllers.users.delete,
    config: {
      description: 'delete user',
      tags: ['api'],
      plugins: {
        'hapi-swagger': {
          responses: Object.assign({}, models.responses, {
            '200': {
              description: 'Success',
              schema: models.user
            }
          })
        },
        'hapi-authorization': {
          role: 'ADMIN'
        }
      },
      validate: {
        headers: models.headers,
        params: {
          id: Joi.number().required().description('user id')
        }
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'routes:user'
}
