const faker = require('faker')

class Book {
  constructor (data = {}) {
    this.symbol = data
    this.bid = {
      quantity: faker.random.number({ min: 100, max: 5000 }),
      value: Number(faker.random.arrayElement([data.lastPrice, data.lastPrice - 0.01, data.lastPrice + 0.01])).toFixed(2)
    }
    this.ask = {
      quantity: faker.random.number({ min: 100, max: 5000 }),
      value: Number(faker.random.arrayElement([data.lastPrice, data.lastPrice - 0.01, data.lastPrice + 0.01])).toFixed(2)
    }
  }
}

module.exports = Book
