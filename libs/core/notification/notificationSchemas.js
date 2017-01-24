var Joi = require('joi');

var apiSchemas = {
    sendNotification: {
        body: Joi.object().keys({
            meta: Joi.object().keys({
                channels: Joi.array().required().min(1)
            }),
            notification: Joi.required()
        }),
        validate: validade
    }
};

function validade(value, schema, callback) {
    Joi.validate(value, schema, function(err, value) {
        callback(err, value);
    });
}

var mongoSchemas = {};

module.exports = {
    apiSchemas: apiSchemas,
    mongoSchemas: mongoSchemas
};