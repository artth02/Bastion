const swagger = require('../swagger/builder.js')

module.exports = (server) => {
  require('./healthCheck.js')(server, swagger)
  require('./notFound.js')(server)
  require('./test.js')(server)
    // Rotas do controller de notificações
  require('../../core/notification/notificationRoute.js')(server, swagger)

    // Rotas do controller de inspeção dos sockets conectados na api
  require('../../core/inspect/inspectRoute.js')(server, swagger)
}
