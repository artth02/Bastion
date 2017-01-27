const Joi = require('joi');

module.exports = (server, swagger) => {
    server.route({
        method: 'GET',
        path: '/bastion/healthcheck/ping',
        config: {
            handler: (request, reply) => {
                reply({
                    message: 'bastion is alive',
                    date: new Date()
                }).code(200);
            },
            description: 'Rota para health check.',
            notes: 'Retorna data atual.',
            tags: ['api', 'bastion', 'bastion-healthcheck'],
            plugins: swagger
                .document()
                .ok()
                .done()
        }
    });
};