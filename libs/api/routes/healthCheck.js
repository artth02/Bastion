module.exports = (server, swagger) => {
  server.route({
    method: 'GET',
    path: '/bastion/healthcheck/ping',
    config: {
      handler: (request, reply) => {
        reply({
          message: 'bastion is alive',
          date: new Date()
        }).code(200)
      },
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
