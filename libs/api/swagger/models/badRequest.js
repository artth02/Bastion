const Joi = require('joi');

module.exports = Joi.object({
    message: Joi.string().required().example('As informações enviadas não são válidas'),
    moreInfo: Joi.object({
        message: Joi.string().required().example('child [field-name] fails because [[field-name] with value [value] fails to match the required pattern: [[some-regex]]]'),
        validation: Joi.object({
            source: Joi.string().required().example('query'),
            keys: Joi.array().items(Joi.string()).required().example(["cpf"]),
        }).required()
    }).required().label('detalhes do erro para desenvolvedores')
});