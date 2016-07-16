const Joi = require('joi')
const models = require('../../models')
const users = require('../../controllers').users

const responses = {
  '401': {
    description: 'Unauthorized',
    schema: models.error
  },
  '500': {
    description: 'Runtime error',
    schema: models.error
  }
}

module.exports = [{
  path: '/{id?}',
  method: 'GET',
  handler: users.get,
  config: {
    description: 'get user[s]',
    auth: 'bearer',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        responses: Object.assign({}, responses, {
          '200': {
            description: 'Success',
            schema: Joi.array().items(models.user)
          }
        })
      }
    },
    validate: {
      headers: models.headers,
      query: {
        limit: Joi.number(),
        page: Joi.number()
      },
      params: {
        id: Joi.string().description('user id')
      }
    }
  }
}, {
  path: '/',
  method: 'POST',
  handler: users.create,
  config: {
    description: 'create new user',
    auth: 'bearer',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        responses: Object.assign({}, responses, {
          '200': {
            description: 'Success',
            schema: models.user
          }
        })
      }
    },
    validate: {
      payload: {
        name: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().alphanum().min(6).max(30).required()
      }
    }
  }
}, {
  path: '/{id}',
  method: 'PUT',
  handler: users.update,
  config: {
    description: 'update user',
    auth: 'bearer',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        responses: Object.assign({}, responses, {
          '200': {
            description: 'Success',
            schema: models.user
          }
        })
      }
    },
    validate: {
      headers: models.headers,
      params: {
        id: Joi.number().required()
      },
      payload: Joi.object({
        name: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email().required()
      }).required()
    }
  }
}, {
  path: '/{id}',
  method: 'DELETE',
  handler: users.delete,
  config: {
    description: 'delete user',
    auth: 'bearer',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        responses: Object.assign({}, responses, {
          '200': {
            description: 'Success',
            schema: models.user
          }
        })
      }
    },
    validate: {
      headers: models.headers,
      params: {
        id: Joi.number().required()
      }
    }
  }
}]
