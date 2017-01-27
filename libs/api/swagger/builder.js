const badRequestModel = require('./models/badRequest.js');

exports.document = () => {
    return {
        ok: ok,
        noContent: noContent,
        badRequest: badRequest,
        notFound: notFound,
        internalServerError: internalServerError,
        done: done,
        swaggerOptions: {}
    };
}

function ok(model, description) {
    this.swaggerOptions['200'] = documentResponse(model, description || 'OK');
    return this;
}

function noContent(model, description) {
    this.swaggerOptions['204'] = documentResponse(model, description || 'No Content');
    return this;
}

function badRequest(model, description) {
    this.swaggerOptions['400'] = documentResponse(model || badRequestModel, description || 'Bad Request');
    return this;
}

function notFound(model, description) {
    this.swaggerOptions['404'] = documentResponse(model, description || 'Not Found');
    return this;
}

function internalServerError(model, description) {
    this.swaggerOptions['500'] = documentResponse(model, description || 'Internal Server Error');
    return this;
}

function documentResponse(model, description) {
    let document = { description };

    if (model)
        document.schema = model;

    return document;
}

function done() {
    return {
        'hapi-swagger': {
            responses: this.swaggerOptions
        }
    }
}