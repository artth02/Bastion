module.exports = (server, swagger) => {
  server.route({
    method: 'GET',
    path: '/bastion/healthcheck/ping',
    handler: (request, reply) => {
      return reply.response({
        message: 'bastion is alive',
        date: new Date()
      }).code(200)
    },
    options: {
      description: 'Health check route.',
      notes: 'Returns current date.',
      tags: ['api', 'Health Check'],

      plugins: swagger
        .document()
        .ok()
        .done()
    }
  })
}
