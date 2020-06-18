const Login = require('./login')
const Symbol = require('./Symbol')
const Order = require('./Order')
const Book = require('./Book')
const faker = require('faker')
const Wallet = require('./Wallet')
const pako = require('pako')

let clients = []
async function start(socket) {
  console.log('start')
  await timeout(500)
  for (let i = 0; i < socket.symbols.length; i++) {
    await timeout(500)

    const item = socket.symbols[i]
    console.log('send', item)
    const response = Buffer.from(JSON.stringify({ type: "subscribeSymbol", data: Symbol.getMarketPrices(item) }))
    const binaryString = pako.deflate(response, { to: 'string' })

    socket.send(binaryString)
  }

  console.log('wsServer.clients', wsServer.clients.size)
  if (wsServer.clients.size && Array.from(wsServer.clients).some(x => x.id === socket.id)) {
    start(socket)
  } else {
    socket.symbols = []
    clients = []
  }
}

async function timeout(ms = 1000) {
  await new Promise((resolve, reject) => {
    setTimeout(() => { resolve() }, ms)
  })
}

function mocks(socket, data) {
  try {
    data = JSON.parse(data)
    console.log('mock data', data)
  } catch (ex) {
    console.log('ex', ex)
    socket.send(JSON.stringify({ type: 'error', data: ex.message }))
  }

  const symb = Symbol.getSymbolsList()

  switch (data.type) {
    case 'login': {
      const response = new Login(data)
      return { type: data.type, data: response }
    }
    case 'subscribeSymbol': {
      if (!clients.some(x => x.id === socket.id)) {
        start(socket)
        socket.symbols = []
        clients.push(socket)
      }

      if (!socket.symbols.some(x => x === data.symbol)) {
        socket.symbols.push(data.symbol)
      }

      console.log('>>>> pushed', data.symbol)
      return { type: data.JSONtype, data: socket.symbols }
    }

    case 'retrieveSymbolsList': {
      return { type: data.type, data: Symbol.getSymbolsList() }
    }
    case 'listOrders': {
      const ordersList = []

      for (let i = 0; i < symb.length; i++) {
        ordersList.push(new Order(symb))
      }
      return { type: data.type, data: ordersList }
    }
    case 'books': {
      const booksList = []
      const lastPrice = parseFloat(faker.finance.amount(100, 1000, 2))
      let item = symb.find(x => x.name === data.symbol)
      if (!item) {
        item = symb[0]
      }

      for (let i = 0; i < 10; i++) {
        item.lastPrice = lastPrice
        booksList.push(new Book(item))
      }
      return { type: data.type, data: booksList }
    }
    case 'wallet': {
      return { type: data.type, data: new Wallet() }
    }
    default: {
      return undefined
    }
  }
}

module.exports = {
  mocks
}
