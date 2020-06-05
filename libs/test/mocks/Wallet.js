const Symbols = require('./Symbol')
const faker = require('faker')

class Wallet {
  constructor () {
    const symbolsList = Symbols.getSymbolsList()
    this.symbols = []

    for (let i = 0; i < symbolsList.length; i++) {
      const symbol = symbolsList[i]
      const lastPrice = parseFloat(faker.finance.amount(100, 1000, 2))
      const quantity = faker.random.number(1000)

      this.symbols.push({
        ...symbol,
        lastPrice,
        quantity,
        value: quantity * lastPrice,
        oscilationRate: faker.random.number(15)
      })
    }
  }
}

module.exports = Wallet
