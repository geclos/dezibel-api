const Joi = require('joi')

exports.register = (server, options, next) => {
  const events = server.plugins.controllers.controllers.events
  const models = server.plugins.models.models
  const Response = models.Response

  const defaultAuthorization = { role: 'VENUE' }
  const defaultResponse = Response(models.event)
  const defaultParams = { id: Joi.number().description('event id') }

  const defaultValidate = {
    headers: models.headers,
    params: { id: Joi.number().description('event id').required() }
  }

  server.route([{
    path: '/',
    method: 'GET',
    handler: events.get,
    config: {
      tags: ['api'],
      description: 'get events',
      plugins: {
        hapiAuthorization: {role: 'ADMIN'},
        'hapi-swagger': Response(Joi.array().items(models.event))
      },
      validate: defaultValidate
    }
  }, {
    path: '/{id}',
    method: 'GET',
    handler: events.get,
    config: {
      tags: ['api'],
      description: 'get event',
      plugins: {
        hapiAuthorization: defaultAuthorization,
        'hapi-swagger': defaultResponse
      },
      validate: defaultValidate
    }
  }, {
    path: '/',
    method: 'POST',
    handler: events.create,
    config: {
      tags: ['api'],
      description: 'create event',
      plugins: {
        hapiAuthorization: defaultAuthorization,
        'hapi-swagger': defaultResponse
      },
      validate: {
        headers: models.headers,
        payload: models.event
      }
    }
  }, {
    path: '/{id}',
    method: 'PUT',
    handler: events.update,
    config: {
      tags: ['api'],
      description: 'update event',
      plugins: {
        hapiAuthorization: defaultAuthorization,
        'hapi-swagger': defaultResponse
      },
      validate: {
        headers: models.headers,
        payload: models.event,
        params: defaultParams
      }
    }
  }, {
    path: '/{id}',
    method: 'DELETE',
    handler: events.delete,
    config: {
      tags: ['api'],
      description: 'delete event',
      plugins: {
        hapiAuthorization: defaultAuthorization,
        'hapi-swagger': defaultResponse
      },
      validate: {
        headers: models.headers,
        params: defaultParams
      }
    }
  }, {
    path: '/findNear',
    method: 'POST',
    handler: events.findNear,
    config: {
      tags: ['api'],
      description: 'find events near a given location',
      plugins: {
        hapiAuthorization: defaultAuthorization,
        'hapi-swagger': Response(Joi.array().items(models.event))
      },
      validate: {
        headers: models.headers,
        payload: Joi.object({
          location: Joi.object({
            coordinates: Joi.array().items(Joi.number()).length(2).required()
          }).required()
        }).required()
      }
    }
  }])

  next()
}

exports.register.attributes = {
  name: 'routes:events'
}
