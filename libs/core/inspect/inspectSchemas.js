var Joi = require('@hapi/joi')

var inspect = {
  query: Joi.optional().default({})
}

var inspectChannel = {
  params: Joi.object({
    channelName: Joi.string().alphanum().required().example('index')
  })
}

module.exports = {
  inspect: inspect,
  inspectChannel: inspectChannel
}
