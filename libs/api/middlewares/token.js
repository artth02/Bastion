const request = require('request'),
    config = require('../../../config/environment.js'),
    apigeeRequest = require('../../infra/apigee/apigeeRequest.js'),
    freeAccessUrls = {
        '/notification/api/v1/ping': 1
    };

module.exports = function (req, res, next) {
    if (freeAccessUrls[req.url.toLowerCase()]) {
        next();
        return;
    }

    if (!req.headers.authorization)
        return res.json(401,
            {
                errorCode: 401,
                developerMessage: 'O header Autorization não contem valor',
                userMessageTranslated: 'Sessao expirada. Efetue login novamente',
                moreInfo: req.headers
            });

    var options = {
        url: config.authentication.url,
        headers: {
            'authorization': req.headers.authorization,
        }
    };

    function autenticateOnApigee(count) {
        request(options, function (error, response, body) {
            apigeeRequest.validateRequest(error, response, body, options, function (requestMessage) {
                if (!requestMessage.isSuccess) {
                    if (count > 0) {
                        autenticateOnApigee(--count);
                    }
                    else {
                        res.json(requestMessage.status, requestMessage.content);
                        next(requestMessage);
                    }
                }
                else {
                    req.user = requestMessage.content;
                    req.user.login = req.user.userLogin + ' - ' + req.user.userName;
                    req.user.accessGroup = req.user.accessGroup;
                    next();
                }
            });
        });
    }

    autenticateOnApigee(3);
};