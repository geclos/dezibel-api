const Joi = require('joi')

const error = Joi.object({
  'error': Joi.string(),
  'message': Joi.string(),
  'statusCode': Joi.number()
})

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

exports.Response = schema => ({
  responses: Object.assign({}, responses, {
    200: {
      description: 'Success',
      schema: schema || {}
    }
  })
})
