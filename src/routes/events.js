const Joi = require('joi')

exports.register = (server, options, next) => {
  const events = server.plugins.controllers.controllers.events
  const models = server.plugins.models.models

  const hapiAuthorization = { role: 'VENUE' }
  const responseSchema = models.ResponseSchema(models.event)
  const paramsSchema = { id: Joi.number().description('event id') }
  const payloadSchema = Joi.object({
    title: Joi.string().required(),
    hostedBy: Joi.number().required(),
    description: Joi.string().required(),
    bands: Joi.array().items(Joi.number()),
    timestamp: Joi.date().timestamp().required()
  }).required()

  server.select('api').route([{
    path: '/',
    method: 'GET',
    handler: events.get,
    config: {
      tags: ['api'],
      description: 'get events',
      plugins: {
        hapiAuthorization: {role: 'ADMIN'},
        'hapi-swagger': {
          responses: models.ResponseSchema(Joi.array().items(models.event))
        }
      },
      validate: {
        headers: models.headers,
        params: { id: Joi.number().description('event id').required() }
      }
    }
  }, {
    path: '/{id}',
    method: 'GET',
    handler: events.get,
    config: {
      tags: ['api'], // so that it get automatically doucmented
      description: 'get event',
      plugins: {
        hapiAuthorization,
        'hapi-swagger': { responses: responseSchema }
      },
      validate: {
        headers: models.headers,
        params: { id: Joi.number().description('event id').required() }
      }
    }
  }, {
    path: '/',
    method: 'POST',
    handler: events.create,
    config: {
      tags: ['api'], // so that it get automatically doucmented
      description: 'create event',
      plugins: {
        hapiAuthorization,
        'hapi-swagger': { responses: responseSchema }
      },
      validate: {
        headers: models.headers,
        payload: payloadSchema
      }
    }
  }, {
    path: '/{id}',
    method: 'PUT',
    handler: events.update,
    config: {
      tags: ['api'], // so that it get automatically doucmented
      description: 'update event',
      plugins: {
        hapiAuthorization,
        'hapi-swagger': { responses: responseSchema }
      },
      validate: {
        headers: models.headers,
        payload: payloadSchema,
        params: paramsSchema
      }
    }
  }, {
    path: '/{id}',
    method: 'DELETE',
    handler: events.delete,
    config: {
      tags: ['api'], // so that it get automatically doucmented
      description: 'delete event',
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
  name: 'routes:events'
}
