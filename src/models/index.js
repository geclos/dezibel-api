const Joi = require('joi')
const roles = require('../shared/constants').roles.slice(1)

exports.register = (server, options, next) => {
  const user = Joi.object({
    name: Joi.string(),
    lastName: Joi.string(),
    id: Joi.number().required(),
    hash: Joi.string().required(),
    email: Joi.string().email().required()
  })

  const userType = Joi.string().valid(roles).description('user type: \'user\', \'band\', \'venue\'. Defaults to \'user\'.')

  const event = Joi.object({
    title: Joi.string(),
    hostedBy: Joi.number(),
    description: Joi.string(),
    timestamp: Joi.date().timestamp(),
    bands: Joi.array().items(Joi.number())
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

  const ResponseSchema = schema => {
    return Object.assign({}, responses, {
      200: {
        description: 'Success',
        schema: schema || {}
      }
    })
  }

  server.expose('models', {
    user,
    event,
    error,
    headers,
    userType,
    responses,
    authorization,
    ResponseSchema
  })

  next()
}

exports.register.attributes = {
  name: 'models'
}
