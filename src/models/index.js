const Joi = require('joi')
const Response = require('./responses').Response

exports.register = (server, options, next) => {
  const user = Joi.object({
    name: Joi.string(),
    lastName: Joi.string(),
    password: Joi.string().required(),
    email: Joi.string().email().required()
  })

  const coordinates = Joi.array()
    .items(Joi.number().required())
    .length(2)
    .required()

  const event = Joi.object({
    description: Joi.string(),
    title: Joi.string().required(),
    hostedBy: Joi.number().required(),
    timestamp: Joi.date().timestamp().required(),
    bands: Joi.array().items(Joi.number()).required(),
    location: Joi.object({
      coordinates: coordinates
    })
  })

  const offer = Joi.object({
    band: Joi.number().required(),
    price: Joi.number().required(),
    hostId: Joi.number().required(),
    message: Joi.string().required(),
    currency: Joi.string().required(),
    timestamp: Joi.date().timestamp().required(),
    event: Joi.object({
      description: Joi.string(),
      title: Joi.string().required(),
      location: Joi.object({
        coordinates: coordinates
      })
    })
  })

  const headers = Joi.object({
    authorization: Joi.string().required().description('bearer token')
  }).unknown()

  server.expose('models', {
    user,
    event,
    offer,
    headers,
    Response
  })

  next()
}

exports.register.attributes = {
  name: 'models'
}
