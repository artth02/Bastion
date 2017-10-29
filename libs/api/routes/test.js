const path = require('path')

module.exports = (server, swagger) => {
  server.route({
    method: 'GET',
    path: '/bastion/cde',
    config: {
      handler: (request, reply) => {
        reply.file(path.join(__dirname, './../../test/index.cde.html'))
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/bastion/cobner',
    config: {
      handler: (request, reply) => {
        reply.file(path.join(__dirname, './../../test/index.cobner.html'))
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/bastion/index',
    config: {
      handler: (request, reply) => {
        reply.file(path.join(__dirname, './../../test/index.html'))
      }
    }
  })
}
