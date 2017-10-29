const inspectController = require('./inspectController.js')
const inspectSchema = require('./inspectSchemas.js')

module.exports = (server, swagger) => {
  server.route({
    method: 'GET',
    path: '/bastion/inspect/channels',
    config: {
      handler: inspectController.inspect,
      validate: {
        query: inspectSchema.inspect.query
      },
      description: 'Canais ativos do bastion.',
      notes: 'Lista todos os canais de comunicação que estão atualmente ativos no bastion.',
      tags: ['api', 'Inspect'],
      plugins: swagger
                .document()
                .ok()
                .badRequest()
                .notFound()
                .done()
    }
  })

  server.route({
    method: 'GET',
    path: '/bastion/inspect/channels/{channelName}',
    config: {
      handler: inspectController.inspectChannel,
      validate: {
        params: {
          channelName: inspectSchema.inspectChannel.params.channelName
        }
      },
      description: 'Sockets ativos nos canais do bastion.',
      notes: 'Lista todos os sockets conectados nos canais de comunicação que estão atualmente ativos no bastion.',
      tags: ['api', 'Inspect'],
      plugins: swagger
                .document()
                .ok()
                .badRequest()
                .notFound()
                .done()
    }
  })
}
