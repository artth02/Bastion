const WebSocket = require('ws')
const config = require('config')
const chalk = require('chalk')
const mocks = require('./../../test/mocks/index')
const pako = require('pako')
const uuid = require('uuid')

/**
 * Method: Initialize websocket server
 */
function init() {
  if (!config.websocket.port) {
    console.error(`${chalk.red('websocket not initialized - missing websocket server port in confi file')}`)
    return
  }

  global.wsServer = new WebSocket.Server({
    port: config.websocket.port,
    perMessageDeflate: {
      zlibDeflateOptions: {
        // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024
      },
      // Other options settable:
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      serverMaxWindowBits: 10, // Defaults to negotiated value.
      // Below options specified as default values.
      concurrencyLimit: 10, // Limits zlib concurrency for perf.
      threshold: 1024 // Size (in bytes) below which messages
      // should not be compressed.
    }
  })
  console.info(`${chalk.green('bastion is running')} websocket server running at ${config.websocket.port}`)
  register(wsServer)
}

function register(wss) {
  wss.on('connection', (ws, request, client) => {
    ws.id = uuid.v4()
    console.log('ws connection')

    ws.on('message', (data) => {
      console.log('data')
      const mockData = mocks.mocks(ws, data)
      console.log('mockdata', mockData)
      if (mockData) {
        const response =  Buffer.from(JSON.stringify(mockData))
        const binaryString = pako.deflate(response, {to: 'string'})
        
        ws.send(binaryString)
        console.log('binary stirng', binaryString)
        console.log('encoded', response)
        console.log('mockData', mockData)
      } else {
        // Calls notification service here to send messagens through socket
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data)
          }
        })
      }
    })
  })
}

module.exports = {
  init
}
