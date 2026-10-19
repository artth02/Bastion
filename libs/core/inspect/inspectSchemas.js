const Joi = require('joi')

const inspect = {
  query: Joi.optional().default({})
}

const inspectChannel = {
  params: Joi.object({
    channelName: Joi.string().alphanum().required().example('index')
  })
}

module.exports = {
  inspect,
  inspectChannel
}
