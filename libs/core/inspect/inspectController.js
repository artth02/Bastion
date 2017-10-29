var notificationService = require('./../notification/notificationService.js')

module.exports = {
  inspect: inspect,
  inspectChannel: inspectChannel
}

function inspect (request, reply) {
  notificationService.inspect(function (data) {
    reply(data).code(200)
  })
}

function inspectChannel (request, reply) {
  notificationService.inspectChannel(request.params.channelName, function (data) {
    reply(data).code(200)
  })
}
