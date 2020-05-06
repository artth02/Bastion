const eventNames = {
  socketIO: {
    emit: 'bastion-emit-notification',
    broadcast: 'bastion-broadcast-notification',
    notification: 'bastion-notification',
    join: 'bastion-join',
    brokerSyncNotification: 'bastion-broker-sync-notification'
  }
}

const namespaces = {
  notification: '/bastion/notification'
}

module.exports = {
  Init: Init,
  emit: emit,
  inspect: inspect,
  inspectChannel: inspectChannel
}

// initialize IO creating the channels
function Init () {
  global.connectedClients = {}

  socketClient.on('connect', (result, result2) => {
    console.log('result resultresult', result)
    socketClient.emit(eventNames.socketIO.join, { customId: 1 }, eventNames.socketIO.brokerSyncNotification)
  })

  var notificationNamespace = socketIO.of(namespaces.notification)
  notificationNamespace.on('connection', function (socket) {
    console.log('new Connection')
    // console.log(`Connected as: ${socket.id}`)
    socket.on(eventNames.socketIO.join, function (connectionOptions, ...channels) {
      // mapping connected user id with the socket id
      socket.customId = connectionOptions.customId
      connectedClients[socket.customId] = socket.id
      // connecting in the params channels
      // console.log(`Joined as: ${socket.customId}`)
      channels.forEach(function (channelName) {
        // console.log(`${socket.customId} joined on ${channelName}`)
        socket.join(channelName)
      })
    })

    // fired event when received an `emit` from some socket
    socket.on(eventNames.socketIO.emit, function (message, ...channels) {
      channels.forEach(function (channelName) {
        socket.in(channelName).emit(eventNames.socketIO.notification, message.notification)
      })
    })

    socket.on(eventNames.socketIO.brokerSyncNotification, (sender) => {
      console.log('socket')
      syncNodes(sender)
    })

    socketClient.on(eventNames.socketIO.brokerSyncNotification, (sender) => {
      console.log('broker sync', eventNames.socketIO.brokerSyncNotification)
      sender.meta.channels.forEach(function (item) {
        socketIO.of(namespaces.notification).in(item).emit(eventNames.socketIO.notification, sender.notification)
      })
    })

    // fired event when received a `broadcast` from some socket
    socket.on(eventNames.socketIO.broadcast, function (message, ...channels) {
      channels.forEach(function (channelName) {
        socket.broadcast.in(channelName).emit(eventNames.socketIO.notification, message.notification)
      })
    })

    // fired whenever there is a disconnection
    socket.on('disconnect', function () {
      delete connectedClients[socket.customId]
      console.log('Disconnected: ' + socket.customId)
    })
  })
}

/**
 * emits a signal to the channels of socketIO socket
 * NOTE: this function is called only by POST in the API
 */
function emit (sender) {
  // sender.meta.channels.forEach(function (item) {
  //   socketIO.of(namespaces.notification).in(item).emit(eventNames.socketIO.notification, sender.notification)
  // })

  socketClient.emit(eventNames.socketIO.brokerSyncNotification, sender)
}

/**
 * Method: Emit messages through bastions servers by broker
 * @param {*} sender - message to sent to some node
 * @param {*} socket - socketClient
 */
function syncNodes (sender) {
  console.log('sender', sender)
  socketIO.of(namespaces.notification).in(eventNames.socketIO.brokerSyncNotification).emit(eventNames.socketIO.brokerSyncNotification, sender)
}

function inspect (callback) {
  var notificationChannels = socketIO.of(namespaces.notification).adapter.rooms
  var result = []
  for (var prop in notificationChannels) {
    if (prop.toString().indexOf('/') === -1) {
      result.push({
        channelName: prop,
        length: notificationChannels[prop].length
      })
    }
  }
  callback(result)
}

function inspectChannel (channelName, callback) {
  var socketsInChannel = socketIO.of(namespaces.notification).in(channelName).sockets
  var result = []
  for (var prop in socketsInChannel) {
    if (socketsInChannel[prop].rooms[channelName]) {
      result.push({
        socketId: socketsInChannel[prop].id,
        customId: socketsInChannel[prop].customId
      })
    }
  }
  callback(result)
}
