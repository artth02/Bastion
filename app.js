const Hapi = require('hapi')
const server = new Hapi.Server()
const cluster = require('cluster')
const env = require('./config/environment.js')
const chalk = require('chalk')

if (cluster.isMaster && env.api.cluster) {
  for (var i = 0; i < env.api.cluster; i += 1) {
    cluster.fork()
  }

  cluster.on('exit', function (worker) {
        // console.error('worker %d died', worker.id);
    cluster.fork()
  })
} else {
  server.connection({ port: env.api.port })

  require('./libs/api/middlewares/preResponse.js')(server)
  require('./libs/api/routes/routes.js')(server)
  var swaggerConfig = require('./libs/api/swagger/configuration.js')

  server.register([
    require('inert'),
    require('vision'),
    swaggerConfig.swaggered,
    swaggerConfig.swaggeredUi

  ], (err) => {
    if (err) { throw err }

    server.start((err) => {
      if (err) {
        console.error(chalk.red('error'), 'Server fault: ' + err)
      } else {
        console.info(chalk.green('bastion is running'), server.info.protocol + ' server at: ' + chalk.bold(server.info.uri))
      }
    })
  });

  (function loadSocketIO () {
    global.socketIO = require('socket.io')(env.socketIO.port)
    require('./libs/core/notification/notificationService.js').Init()
    console.info(chalk.green('bastion is running'), 'socket-IO server at: ' + chalk.bold(server.info.protocol + '://' + server.info.host + ':' + env.socketIO.port))
  })()
}
