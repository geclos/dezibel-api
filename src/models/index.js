const Joi = require('joi')

const user = Joi.object({
  name: Joi.string(),
  lastName: Joi.string(),
  id: Joi.number().required(),
  hash: Joi.string().required(),
  token: Joi.string().required(),
  email: Joi.string().email().required()
})

const error = Joi.object({
  'error': Joi.string(),
  'message': Joi.string(),
  'statusCode': Joi.number()
})

const authorization = Joi.string().required().description('bearer token')

const headers = Joi.object({ authorization: authorization }).unknown()

module.exports = {
  user,
  error,
  headers,
  authorization
}
