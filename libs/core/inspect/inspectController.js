var notificationService = require('./../notification/notificationService.js')

module.exports = {
  inspect: inspect,
  inspectChannel: inspectChannel
}

function inspect (request, reply) {
  const data = notificationService.inspect()
  reply(data).code(200)
}

function inspectChannel (request, reply) {
  const data = notificationService.inspectChannel(request.params.channelName)
  reply(data).code(200)
}
