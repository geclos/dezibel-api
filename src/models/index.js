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

  server.expose('models', {
    user,
    error,
    headers,
    authorization
  })

  next()
}

exports.register.attributes = {
  name: 'models'
}
