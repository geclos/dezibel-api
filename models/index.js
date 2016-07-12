const Joi = require('joi')

module.exports.response = {
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

module.exports.headers = {
  authorization: Joi.object({
    'authorization': Joi.string().required()
  }).unknown()
}
