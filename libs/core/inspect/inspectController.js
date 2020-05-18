var notificationService = require('./../notification/notificationService.js')

module.exports = {
  inspect: inspect,
  inspectChannel: inspectChannel
}

function inspect (request, reply) {
  const data = notificationService.inspect()
  return reply.response(data).code(200)
}

function inspectChannel (request, reply) {
  const data = notificationService.inspectChannel(request.params.channelName)
  return reply.response(data).code(200)
}
