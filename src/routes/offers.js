const Joi = require('Joi')

exports.register = (server, options, next) => {
  const models = server.plugins.models.models
  const offers = server.plugins.controllers.controllers.offers

  const Response = models.Response

  const defaultResponse = Response(models.offer)
  const defaultAuthorization = {roles: ['VENUE', 'BAND']}
  const defaultParams = {id: Joi.number().required().description('offer id')}

  server.route([{
    path: '/',
    method: 'GET',
    handler: offers.get,
    config: {
      tags: ['api'],
      description: 'get all offers user participates on (as host or band)',
      plugins: {
        hapiAuthorization: defaultAuthorization,
        'hapi-swagger': Response(Joi.array().items(models.offer))
      },
      validate: {
        headers: models.headers
      }
    }
  }, {
    path: '/{id}',
    method: 'GET',
    handler: offers.get,
    config: {
      tags: ['api'],
      description: 'get offer by id',
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
    path: '/',
    method: 'POST',
    handler: offers.create,
    config: {
      tags: ['api'],
      description: 'create offer',
      plugins: {
        hapiAuthorization: defaultAuthorization,
        'hapi-swagger': Response(Joi.object({id: Joi.number()}))
      },
      validate: {
        headers: models.headers,
        payload: models.offer.required()
      }
    }
  }, {
    path: '/{id}/accept',
    method: 'POST',
    handler: offers.accept,
    config: {
      tags: ['api'],
      description: 'accept offer',
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
    path: '/{id}/reject',
    method: 'POST',
    handler: offers.reject,
    config: {
      tags: ['api'],
      description: 'reject offer',
      plugins: {
        hapiAuthorization: defaultAuthorization,
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
  name: 'routes:offers'
}
