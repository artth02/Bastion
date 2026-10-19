const brokerService = require('./../broker/broker.service')
const eventNames = require('../common/eventNames.json')
const namespaces = require('../common/namespaces.json')

// initialize IO creating the channels
function init () {
  global.connectedClients = {}

  const notificationNamespace = socketIO.of(namespaces.notification)

  notificationNamespace.on('connection', (socket) => {
    console.log('new Connection')

    brokerService.addBrokerListeners({
      client: socketIO,
      server: socket
    })

    addListeners({ client: socket })
  })
}

function addListeners (socket) {
  join(socket)
  emit(socket)
  broadcast(socket)
  brokerSync(socket)
  disconnect(socket)
}

/**
 * Method: Socket join event
 * @param {{client: Object}} socket - socket object with socket clieck to sent messages to everyone connected to api
 */
function join (socket) {
  socket.client.on(eventNames.socketIO.join, (connectionOptions, ...channels) => {
    // mapping connected user id with the socket id
    socket.client.customId = connectionOptions.customId
    connectedClients[socket.client.customId] = socket.client.id

    // connecting in the params channels
    channels.forEach((channelName) => {
      socket.client.join(channelName)
    })
  })
}

/**
 * Method: Socket emit event
 * @param {{client: Object}} socket - socket object with socket clieck to sent messages to everyone connected to api
 */
function emit (socket) {
  // fired event when received an `emit` from some socket
  socket.client.on(eventNames.socketIO.emit, (message, ...channels) => {
    socketIO
      .of(namespaces.notification)
      .in(eventNames.socketIO.brokerSyncNotification)
      .emit(eventNames.socketIO.brokerSyncNotification, message)
  })
}

/**
 * Method: Emit messages through bastions servers by broker
 * @param {{client: Object}} socket - socketClient
 */
function brokerSync (socket) {
  socket.client.on(eventNames.socketIO.brokerSyncNotification, (sender) => {
    socketIO
      .of(namespaces.notification)
      .in(eventNames.socketIO.brokerSyncNotification)
      .emit(eventNames.socketIO.brokerSyncNotification, sender)
  })
}

/**
 * Method: Broadcast messages through bastions servers by broker
 * @param {{client: Object}} socket - socketClient
 */
function broadcast (socket) {
  // fired event when received a `broadcast` from some socket
  socket.client.on(eventNames.socketIO.broadcast, (message, ...channels) => {
    socketIO
      .of(namespaces.notification)
      .in(eventNames.socketIO.brokerBroadcastSyncNotification)
      .emit(eventNames.socketIO.brokerBroadcastSyncNotification, {
        meta: {
          channels
        },
        notification: message.notification
      })
  })
}

function inspect () {
  const { rooms, sids } = socketIO.of(namespaces.notification).adapter
  const result = []
  for (const [channelName, socketIds] of rooms) {
    // every socket auto-joins a private room named by its own id; skip those
    if (!sids.has(channelName)) {
      result.push({
        channelName,
        length: socketIds.size
      })
    }
  }

  return result
}

function disconnect (socket) {
  // fired whenever there is a disconnection
  socket.client.on(eventNames.socketIO.disconnect, () => {
    delete connectedClients[socket.client.customId]
    console.info('disconnected: ' + socket.client.customId)
  })
}

function inspectChannel (channelName) {
  const namespace = socketIO.of(namespaces.notification)
  const socketIds = namespace.adapter.rooms.get(channelName) || new Set()
  const result = []
  for (const socketId of socketIds) {
    const socket = namespace.sockets.get(socketId)
    if (socket) {
      result.push({
        socketId: socket.id,
        customId: socket.customId
      })
    }
  }

  return result
}

/**
 * emits a signal to the channels of socketIO socket
 * NOTE: this function is called only by POST in the API
 */
function brokerEmit (sender) {
  brokerService.emit({ eventName: eventNames.socketIO.brokerSyncNotification }, sender)
}

module.exports = {
  init,
  broker: {
    emit: brokerEmit
  },
  inspect,
  inspectChannel
}
