const Joi = require('joi')

const user = Joi.object({ id: Joi.string().required() }).unknown()

const error = Joi.object({
  'error': Joi.string(),
  'message': Joi.string(),
  'statusCode': Joi.number()
})

const authorization = Joi.string().required().description('bearer token')

const headers = Joi.object({
  authorization: authorization
}).unknown()

module.exports = {
  user,
  error,
  headers,
  authorization
}
