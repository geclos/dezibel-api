const Joi = require('joi')
const roles = require('../shared/constants').roles.slice(1)

exports.register = (server, options, next) => {
  const models = server.plugins['models'].models
  const users = server.plugins['controllers'].controllers.users

  const Response = models.Response // Response schema constructor

  const payload = Joi.object({
    id: Joi.number(),
    name: Joi.string(),
    hash: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email()
  })

  const defaultResponse = Response(payload)
  const defaultParams = {id: Joi.number().required().description('user id')}

  server.route([{
    path: '/{id}',
    method: 'GET',
    handler: users.get,
    config: {
      tags: ['api'],
      description: 'get user/s',
      plugins: { 'hapi-swagger': defaultResponse },
      validate: {
        params: defaultParams,
        headers: models.headers
      }
    }
  }, {
    path: '/',
    method: 'POST',
    handler: users.create,
    config: {
      tags: ['api'],
      description: 'create new user',
      auth: false,
      plugins: { 'hapi-swagger': defaultResponse },
      validate: {
        payload: Joi.object({
          name: Joi.string(),
          lastName: Joi.string(),
          email: Joi.string().email().required(),
          password: Joi.string().alphanum().min(6).max(30).required()
        }).required()
      }
    }
  }, {
    path: '/{id}',
    method: 'PUT',
    handler: users.update,
    config: {
      tags: ['api'],
      description: 'update user',
      plugins: { 'hapi-swagger': defaultResponse },
      validate: {
        headers: models.headers,
        params: defaultParams,
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
        'hapi-swagger': defaultResponse
      },
      validate: {
        headers: models.headers,
        params: defaultParams
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'routes:user'
}
