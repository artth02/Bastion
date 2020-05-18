const Joi = require('@hapi/joi')

module.exports = Joi.object({
  message: Joi.string().required().example('Invalid information'),
  moreInfo: Joi.object({
    message: Joi.string().required().example('child [field-name] fails because [[field-name] with value [value] fails to match the required pattern: [[some-regex]]]'),
    validation: Joi.object({
      source: Joi.string().required().example('query'),
      keys: Joi.array().items(Joi.string().example('cpf')).required()
    }).required()
  }).required().label('error details')
})
