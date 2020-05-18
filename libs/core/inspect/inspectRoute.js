const inspectController = require('./inspectController.js')
const inspectSchema = require('./inspectSchemas.js')

const register = (server, swagger) => {
  server.route({
    method: 'GET',
    path: '/bastion/inspect/channels',
    handler: inspectController.inspect,
    options: {
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
    handler: inspectController.inspectChannel,
    options: {
      validate: {
        params: inspectSchema.inspectChannel.params
      },
      description: 'Lists active clients in a channel.',
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

module.exports = register
