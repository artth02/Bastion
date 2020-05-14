const notificationService = require('./notificationService.js')

module.exports = {
  sendNotification: sendNotification
}

function sendNotification (req, reply) {
  notificationService.broker.emit(req.payload)
  reply().code(204)
}
