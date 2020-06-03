const Hapi = require('@hapi/hapi')
const cluster = require('cluster')
const env = require('config')
const chalk = require('chalk')
const sns = require('./libs/infra/aws/sns')

process.on('unhandledRejection', (err) => {
  console.error(chalk.red('error'), 'Server fault: ' + err.message + ' | ' + err.stack)
  process.exit(1)
})

if (cluster.isMaster && env.api.cluster) {
  for (var i = 0; i < env.api.cluster; i += 1) {
    cluster.fork()
  }

  cluster.on('exit', function (worker) {
    console.error('worker %d died', worker.id)
    cluster.fork()
  })
} else {
  (async () => {
    const server = new Hapi.Server({
      port: env.api.port,
      routes: {
        cors: true
      }
    })

    require('./libs/api/middlewares/preResponse.js')(server)
    require('./libs/api/routes/routes.js')(server)
    const swaggerConfig = require('./libs/api/swagger/configuration.js')

    await server.register([
      { plugin: require('inert') },
      { plugin: require('vision') },
      swaggerConfig.swaggered,
      swaggerConfig.swaggeredUi
    ])

    await server.start()

    console.info(chalk.green('bastion is running'), server.info.protocol + ' server at: ' + chalk.bold(server.info.uri))
    if (env.aws.sns.enabled) {
      sns.subscribe(server, env)
    }

    const socketServerInfo = server.info.protocol + '://' + server.info.host + ':' + env.socketIO.port
    global.socketIO = require('socket.io')(env.socketIO.port)
    const io = require('socket.io-client')
    console.info('env.socketIO.broker.url', env.socketIO.broker.url)
    global.socketClient = io.connect(env.socketIO.broker.url || `${socketServerInfo}/bastion/notification`)

    require('./libs/core/notification/notificationService.js').init()
    require('./libs/core/broker/broker.service').init()
    require('./libs/infra/websocket/index').init()

    console.info(chalk.green('bastion is running'), 'socket-IO server at: ' + chalk.bold(socketServerInfo))
  })()
}
