const Joi = require('joi')

exports.register = (server, options, next) => {
  const models = server.plugins['models'].models
  const users = server.plugins['controllers'].controllers.users

  const hapiAuthorization = { role: 'USER' }
  const responseSchema = models.ResponseSchema(models.user)
  const paramsSchema = {id: Joi.number().required().description('user id')}

  server.route([{
    path: '/',
    method: 'GET',
    handler: users.get,
    config: {
      tags: ['api'],
      description: 'get users',
      plugins: {
        hapiAuthorization: {role: 'ADMIN'},
        'hapi-swagger': {
          responses: models.ResponseSchema(models.user)
        }
      },
      validate: {
        params: paramsSchema,
        headers: models.headers,
        query: {
          limit: Joi.number(),
          page: Joi.number()
        }
      }
    }
  }, {
    path: '/{id}',
    method: 'GET',
    handler: users.get,
    config: {
      tags: ['api'],
      description: 'get user',
      plugins: {
        hapiAuthorization,
        'hapi-swagger': {
          responses: models.ResponseSchema(Joi.array().items(models.user))
        }
      },
      validate: {
        params: paramsSchema,
        headers: models.headers,
        query: {
          limit: Joi.number(),
          page: Joi.number()
        }
      }
    }
  }, {
    path: '/{userType?}',
    method: 'POST',
    handler: users.create,
    config: {
      tags: ['api'],
      description: 'create new user',
      auth: false,
      plugins: {
        'hapi-swagger': { responses: responseSchema }
      },
      validate: {
        payload: Joi.object({
          name: Joi.string(),
          lastName: Joi.string(),
          email: Joi.string().email().required(),
          password: Joi.string().alphanum().min(6).max(30).required()
        }).required(),
        params: { userType: models.userType }
      }
    }
  }, {
    path: '/{id}',
    method: 'PUT',
    handler: users.update,
    config: {
      tags: ['api'],
      description: 'update user',
      plugins: {
        hapiAuthorization,
        'hapi-swagger': { responses: responseSchema }
      },
      validate: {
        headers: models.headers,
        params: paramsSchema,
        payload: Joi.object({
          name: Joi.string(),
          lastName: Joi.string()
        }).required()
      }
    }
  }, {
    path: '/{id}',
    method: 'DELETE',
    handler: users.delete,
    config: {
      tags: ['api'],
      description: 'delete user',
      plugins: {
        hapiAuthorization,
        'hapi-swagger': { responses: responseSchema }
      },
      validate: {
        headers: models.headers,
        params: paramsSchema
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'routes:user'
}
