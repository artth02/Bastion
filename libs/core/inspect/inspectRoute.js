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
      description: 'Bastions active channels.',
      notes: 'List all active chaneels.',
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
      description: 'Active clients in a channel.',
      notes: 'Lists all connected clients in a channel.',
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
