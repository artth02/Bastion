const uuid = require('uuid')
const eventNames = require('../common/eventNames.json')
const namespaces = require('../common/namespaces.json')

/**
 * Initiates broker service
 */
function init () {
  console.info('broker initialized')
  socketClient.on('connect', (result) => {
    console.info('connected to broker', result)
    socketClient.emit(eventNames.socketIO.join, { customId: uuid.v4() }, eventNames.socketIO.brokerSyncNotification)
    socketClient.emit(eventNames.socketIO.join, { customId: uuid.v4() }, eventNames.socketIO.brokerBroadcastSyncNotification)
  })
}

function addBrokerListeners (socket) {
  addBrokerSyncListener(socket)
  addBrokerBroadcastSyncListener(socket)
}

/**
 * Method: add broker sync listener
 * @param {{client: Object, eventName: string }} socket - socket object
 */
function addBrokerSyncListener (socket) {
  const brokerSyncNotification = eventNames.socketIO.brokerSyncNotification

  if (!socketClient.listeners(brokerSyncNotification).length) {
    socketClient.on(brokerSyncNotification, (sender) => {
      sender.meta.channels.forEach(function (item) {
        socketIO
          .of(namespaces.notification)
          .in(item)
          .emit(eventNames.socketIO.notification, sender.notification)
      })
    })
  }
}

/**
 * Method: add broker broadcast sync listener
 * @param {{client: Object, eventName: string }} socket - socket object
 */
function addBrokerBroadcastSyncListener (socket) {
  const brokerBroadcastSyncNotification = eventNames.socketIO.brokerBroadcastSyncNotification

  if (!socketClient.listeners(brokerBroadcastSyncNotification).length) {
    socketClient.on(brokerBroadcastSyncNotification, (sender) => {
      sender.meta.channels.forEach((channelName) => {
        socket.server.broadcast.in(channelName).emit(eventNames.socketIO.notification, sender.notification)
      })
    })
  }
}

/**
 * Method: Emit a message to sync all current nodes
 * @param {{client: Object, eventName: string }} socket - socket object
 * @param {Object} data - data to sync to nodes
 */
function emit (socket, data) {
  socketClient.emit(socket.eventName, data)
}

module.exports = {
  addBrokerListeners,
  emit,
  init
}
