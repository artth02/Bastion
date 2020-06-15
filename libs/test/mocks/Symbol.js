const faker = require('faker')

function getMarketPrices (symbolName) {
  const lastPrice = faker.finance.amount(300, 500, 2)
  const operations = []
  for (let index = 0; index < 5; index++) {
    operations.push({
      buyPrice: faker.finance.amount(300, 500, 2),
      buyQuantity: 5,
      sellPrice: faker.finance.amount(300, 800, 2),
      sellQuantity: 5
    })
  }

  return {
    symbol: {
      name: symbolName,
      lastPrice: lastPrice,
      quantity: 10,
      oscilationRate: 6
    },
    operations,
    dailyPrice: {
      min: lastPrice,
      max: 500
    },
    makertPrice: {
      open: lastPrice,
      close: undefined
    },
    timestamp: new Date().getTime()
  }
}

function getSymbolsList () {
  return [{
    name: 'DOL',
    description: 'Dolar'
  },
  {
    name: 'PETR4',
    description: 'Petrobrás'
  },
  {
    name: 'MGLU3',
    description: 'Magalu'
  },
  {
    name: 'MDB',
    description: 'MongoDB'
  }]
}

module.exports = { getMarketPrices, getSymbolsList }
