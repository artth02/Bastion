const Login = require('./login')
const Symbol = require('./Symbol')
const Order = require('./Order')
const Book = require('./Book')
const faker = require('faker')
const Wallet = require('./Wallet')

let clients = []
async function start (socket) {
  console.log('start')
  await timeout(500)
  for (let i = 0; i < socket.symbols.length; i++) {
    await timeout(500)

    const item = socket.symbols[i]
    console.log('a', i)
    console.log('send', item)
    socket.send(JSON.stringify(Symbol.getMarketPrices(item)))
  }

  console.log('wsServer.clients', wsServer.clients.size)
  if (wsServer.clients.size && Array.from(wsServer.clients).some(x => x.id === socket.id)) {
    start(socket)
  } else {
    socket.symbols = []
    clients = []
  }
}

async function timeout (ms = 1000) {
  await new Promise((resolve, reject) => {
    setTimeout(() => { resolve() }, ms)
  })
}

function mocks (socket, data) {
  try {
    data = JSON.parse(data)
    console.log('mock data', data)
  } catch (ex) {
    console.log('ex', ex)
    socket.error(ex)
  }

  const symb = Symbol.getSymbolsList()

  switch (data.type) {
    case 'login': {
      const response = new Login(data)
      return response
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
      return socket.symbols
    }

    case 'retrieveSymbolsList': {
      return Symbol.getSymbolsList()
    }
    case 'listOrders': {
      const ordersList = []

      for (let i = 0; i < symb.length; i++) {
        ordersList.push(new Order(symb))
      }
      return ordersList
    }
    case 'books': {
      const booksList = []
      const lastPrice = parseFloat(faker.finance.amount(100, 1000, 2))
      const item = symb.find(x => x.name === data.symbol)
      for (let i = 0; i < 10; i++) {
        item.lastPrice = lastPrice
        booksList.push(new Book(item))
      }
      return booksList
    }
    case 'wallet': {
      return new Wallet()
    }
    default: {
      return undefined
    }
  }
}

module.exports = {
  mocks
}
