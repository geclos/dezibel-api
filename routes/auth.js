const Joi = require('joi')

module.exports = [{
  method: 'POST',
  path: '/login',
  config: {
    handler: (req, reply) => reply({token: 'success'}).code(200),
    description: 'Login to dezibel API',
    tags: ['api'],
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': {
            'description': 'Success',
            'schema': Joi.object({ token: Joi.string() }).label('Result')
          }
        }
      }
    },
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required().description('user email'),
        password: Joi.string().alphanum().min(8).max(30).required().description('user password')
      }).required()
    }
  }
}]
