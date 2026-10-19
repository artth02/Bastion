const Hapi = require('@hapi/hapi')
const Joi = require('joi')
const cluster = require('node:cluster')
const { styleText } = require('node:util')
const env = require('config')
const sns = require('./libs/infra/aws/sns')

process.on('unhandledRejection', (err) => {
  console.error(styleText('red', 'error'), 'Server fault: ' + err.message + ' | ' + err.stack)
  process.exit(1)
})

if (cluster.isPrimary && env.api.cluster) {
  for (let i = 0; i < env.api.cluster; i += 1) {
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

    server.validator(Joi)
    require('./libs/api/middlewares/preResponse.js')(server)
    require('./libs/api/routes/routes.js')(server)
    const swaggerConfig = require('./libs/api/swagger/configuration.js')

    await server.register([
      { plugin: require('@hapi/inert') },
      { plugin: require('@hapi/vision') },
      swaggerConfig.swagger
    ])

    await server.start()

    console.info(styleText('green', 'bastion is running'), server.info.protocol + ' server at: ' + styleText('bold', server.info.uri))
    if (env.aws.sns.enabled) {
      sns.subscribe(server, env)
    }

    const socketServerInfo = server.info.protocol + '://' + server.info.host + ':' + env.socketIO.port
    global.socketIO = require('socket.io')(env.socketIO.port, {
      // socket.io v2 allowed any origin and EIO3 clients; keep both so existing consumers still connect
      cors: { origin: true, credentials: true },
      allowEIO3: true
    })
    const { io } = require('socket.io-client')
    console.info('env.socketIO.broker.url', env.socketIO.broker.url)
    global.socketClient = io(env.socketIO.broker.url || `${socketServerInfo}/bastion/notification`)

    require('./libs/core/notification/notificationService.js').init()
    require('./libs/core/broker/broker.service').init()
    require('./libs/infra/websocket/index').init()

    console.info(styleText('green', 'bastion is running'), 'socket-IO server at: ' + styleText('bold', socketServerInfo))
  })()
}
