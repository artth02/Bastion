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
      description: 'Envia informação para um canal.',
      notes: 'Envia um json para qualquer canal existente na api.',
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
