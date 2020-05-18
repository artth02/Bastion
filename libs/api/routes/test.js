const path = require('path')

module.exports = (server, swagger) => {
  server.route({
    method: 'GET',
    path: '/bastion/cde',
    handler: (request, reply) => {
      return reply.file(path.join(__dirname, './../../test/index.cde.html'))
    }
  })

  server.route({
    method: 'GET',
    path: '/bastion/cobner',
    handler: (request, reply) => {
      return reply.file(path.join(__dirname, './../../test/index.cobner.html'))
    }
  })

  server.route({
    method: 'GET',
    path: '/bastion/index',
    handler: (request, reply) => {
      return reply.file(path.join(__dirname, './../../test/index.html'))
    }
  })
}
