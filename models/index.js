const Joi = require('joi')

exports.response = {
  unauthorized: {
    'description': 'Unauthorized',
    'schema': Joi.object({
      'error': Joi.string(),
      'message': Joi.string(),
      'statusCode': Joi.number()
    })
  },
  defaultSuccess: {
    'description': 'Success',
    'schema': Joi.string().label('Result')
  }
}

exports.headers = {
  authorization: Joi.object({
    'authorization': Joi.string().required()
  }).unknown()
}

exports.user = Joi.object({
  hash: Joi.string(),
  name: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email().require()
})
