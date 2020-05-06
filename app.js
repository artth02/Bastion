const Hapi = require('hapi')
const cluster = require('cluster')
const env = require('config')
const chalk = require('chalk')
const sns = require('./libs/infra/aws/sns')

if (cluster.isMaster && env.api.cluster) {
  for (var i = 0; i < env.api.cluster; i += 1) {
    cluster.fork()
  }

  cluster.on('exit', function (worker) {
    console.error('worker %d died', worker.id)
    cluster.fork()
  })
} else {
  let serverOptions

  const server = new Hapi.Server(serverOptions)

  server.connection({
    port: env.api.port,
    routes: {
      cors: true
    }
  })

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
        if (env.aws.sns.enabled) {
          sns.subscribe(server, env)
        }
      }
    })
  });

  (function loadSocketIO () {
    const socketServerInfo = server.info.protocol + '://' + server.info.host + ':' + env.socketIO.port
    global.socketIO = require('socket.io')(env.socketIO.port)
    const io = require('socket.io-client')
    console.log('env.socketIO.broker.url', env.socketIO.broker.url)
    global.socketClient = io.connect(env.socketIO.broker.url || `${socketServerInfo}/bastion/notification`)

    require('./libs/core/notification/notificationService.js').Init()
    console.info(chalk.green('bastion is running'), 'socket-IO server at: ' + chalk.bold(socketServerInfo))
  })()
}
