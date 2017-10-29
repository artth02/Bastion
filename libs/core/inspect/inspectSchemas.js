var Joi = require('joi')

var inspect = {
  query: Joi.empty().required()
}

var inspectChannel = {
  params: {
    channelName: Joi.string().alphanum().min(1).required()
  }
}

module.exports = {
  inspect: inspect,
  inspectChannel: inspectChannel
}
