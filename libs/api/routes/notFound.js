module.exports = (server) => {
  server.route({
    method: '*',
    path: '/{p*}',
    config: {
      handler: (request, reply) => {
        reply({
          message: 'Not Found - bastion know nothing about this route'
        }).code(404)
      }
    }
  })
}
