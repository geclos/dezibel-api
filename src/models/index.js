const Joi = require('joi')

exports.register = (server, options, next) => {
  const user = Joi.object({
    name: Joi.string(),
    lastName: Joi.string(),
    id: Joi.number().required(),
    hash: Joi.string().required(),
    email: Joi.string().email().required()
  })

  const error = Joi.object({
    'error': Joi.string(),
    'message': Joi.string(),
    'statusCode': Joi.number()
  })

  const authorization = Joi.string().required().description('bearer token')

  const headers = Joi.object({ authorization: authorization }).unknown()

  const responses = {
    204: {
      description: 'Content not found',
      schema: error
    },
    400: {
      description: 'Invalid request payload',
      schema: error
    },
    401: {
      description: 'Unauthorized',
      schema: error
    },
    403: {
      description: 'Forbidden',
      schema: error
    },
    500: {
      description: 'Runtime error',
      schema: error
    }
  }

  server.expose('models', {
    user,
    error,
    headers,
    responses,
    authorization
  })

  next()
}

exports.register.attributes = {
  name: 'models'
}
