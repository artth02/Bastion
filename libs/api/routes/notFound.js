module.exports = (server) => {
  server.route({
    method: '*',
    path: '/{p*}',
    handler: (request, reply) => {
      return reply.response({
        message: 'Not Found - bastion know nothing about this route'
      }).code(404)
    }
  })
}
