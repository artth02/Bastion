const notificationController = require('./notificationController.js')
const notificationSchemas = require('./notificationSchemas.js')

module.exports = (server, swagger) => {
  server.route({
    method: 'POST',
    path: '/bastion/notification',
    config: {
      handler: notificationController.sendNotification,
      validate: {
        payload: notificationSchemas.sendNotification.body
      },
      description: 'Send data to a channel.',
      notes: 'Send an information to one or more active channels.',
      tags: ['api', 'Notification'],
      plugins: swagger
                .document()
                .ok()
                .badRequest()
                .notFound()
                .done()
    }
  })
}
