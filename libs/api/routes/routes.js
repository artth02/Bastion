const swagger = require('../swagger/builder.js')

module.exports = (server) => {
  require('./healthCheck.js')(server, swagger)
  require('./notFound.js')(server)
  require('./test.js')(server)
  // Notification controller routes
  require('../../core/notification/notificationRoute.js')(server, swagger)

  // socket inspection routes
  require('../../core/inspect/inspectRoute.js')(server, swagger)
}
