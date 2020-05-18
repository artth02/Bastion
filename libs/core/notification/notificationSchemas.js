var Joi = require('@hapi/joi')

var sendNotification = {
  body: Joi.object().keys({
    meta: Joi.object().keys({
      channels: Joi.array().required().min(1)
    }),
    notification: Joi.any().required()
  })
}

module.exports = {
  sendNotification: sendNotification
}
