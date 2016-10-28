
module.exports = function(req,res,next){
    if(!res.finished)
        next({
            developerMessage: 'Recurso não encontrado',
            message: 'A operação solicitada não foi encontrada',
            status: 404
        });
    else
        res.end();
};