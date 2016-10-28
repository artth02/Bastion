module.exports = function(err, req, res, next) {
    let error = {};

    if(err.assertion){
        err.assertion = undefined
        
        error = {
            developerMessage: "Should throws an Exception: " + err.operator,
            userMessageTranslated: 'Os dados enviados não são validos',
            errorCode: 400,
            moreInfo: err
        };
    }
    else
        error = {
            developerMessage: err.message || 'não foi gerada mensagem de erro (verifique a propriedade "moreInfo")',
            userMessageTranslated: err.userMessageTranslated || 'Não foi possivel concluir a operação solicitada',
            errorCode: err.status || 500,
            moreInfo: err
        };

    if(!res.finished)
        res.status(error.errorCode).json(error);

    res.end();
};