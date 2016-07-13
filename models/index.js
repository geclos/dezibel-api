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
  defaultJSON: {
    'description': 'Success',
    'schema': Joi.object().unknown().label('json')
  }
}

module.exports.headers = {
  authorization: Joi.object({
    'authorization': Joi.string().required()
  }).unknown()
}
