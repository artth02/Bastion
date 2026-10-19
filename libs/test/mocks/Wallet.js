const Symbols = require('./Symbol')
const { faker } = require('@faker-js/faker')

class Wallet {
  constructor () {
    const symbolsList = Symbols.getSymbolsList()
    this.symbols = []

    for (let i = 0; i < symbolsList.length; i++) {
      const symbol = symbolsList[i]
      const lastPrice = parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 }))
      const quantity = faker.number.int(1000)

      this.symbols.push({
        ...symbol,
        lastPrice,
        quantity,
        value: quantity * lastPrice,
        oscilationRate: faker.number.int(15)
      })
    }
  }
}

module.exports = Wallet
